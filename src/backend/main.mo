import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  module Gender {
    public func fromText(gender : Text) : Gender {
      switch (gender.toLower()) {
        case ("male") { #male };
        case ("female") { #female };
        case (_) { #other };
      };
    };
  };

  type Gender = { #male; #female; #other };

  type MembershipTier = {
    #basic;
    #premium;
    #gold;
  };

  module MembershipTier {
    public func fromText(tier : Text, ) : MembershipTier {
      switch (tier.toLower()) {
        case ("basic") { #basic };
        case ("premium") { #premium };
        case (_) { #gold };
      };
    };
  };

  type Profile = {
    displayName : Text;
    age : Nat;
    gender : Gender;
    city : Text;
    bio : Text;
    interests : [Text];
    photo : ?Storage.ExternalBlob;
    membershipTier : MembershipTier;
    membershipExpiry : Time.Time;
  };

  module Profile {
    public func compare(p1 : Profile, p2 : Profile) : Order.Order {
      Text.compare(p1.displayName, p2.displayName);
    };
  };

  // Persistent state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Profiles
  let profiles = Map.empty<Principal, Profile>();

  func getProfileInternal(user : Principal) : Profile {
    switch (profiles.get(user)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Profile not found") };
    };
  };

  // Likes and Matches
  let likes = Map.empty<Principal, Map.Map<Principal, ()>>();
  let matches = Map.empty<Principal, Map.Map<Principal, ()>>();

  func compareProfileArrayLength(a : [Profile], b : [Profile]) : Order.Order {
    Nat.compare(b.size(), a.size());
  };

  func compareByFewerMatches(a : [Profile], b : [Profile]) : Order.Order {
    Nat.compare(a.size(), b.size());
  };

  func compareByNoMatches(a : [Profile], b : [Profile]) : Order.Order {
    switch (a.size(), b.size()) {
      case (0, 0) { #equal };
      case (0, _) { #less };
      case (_, 0) { #greater };
      case (_) { #equal };
    };
  };

  func hasAlreadyLiked(likedSet : Map.Map<Principal, ()>, target : Principal) : Bool {
    likedSet.containsKey(target);
  };

  func isAlreadyMatched(matchedSet : Map.Map<Principal, ()>, target : Principal) : Bool {
    matchedSet.containsKey(target);
  };

  func getGenderOfUser(user : Principal) : Gender {
    getProfileInternal(user).gender;
  };

  public query ({ caller }) func getProfilesByGender(gender : Gender) : async [Profile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse profiles");
    };
    profiles.values().toArray().filter(
      func(profile) { profile.gender == gender }
    );
  };

  public query ({ caller }) func getOppositeGenderProfiles() : async [Profile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse profiles");
    };
    switch (profiles.get(caller)) {
      case (null) { [] };
      case (?p) {
        switch (p.gender) {
          case (#male) { profiles.values().toArray().filter(func(prof) { prof.gender == #female }) };
          case (#female) { profiles.values().toArray().filter(func(prof) { prof.gender == #male }) };
          case (#other) { profiles.values().toArray().filter(func(prof) { prof.gender != #other }) };
        };
      };
    };
  };

  public shared ({ caller }) func likeProfile(target : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like profiles");
    };
    if (caller == target) {
      Runtime.trap("Cannot like own profile");
    };
    var likedSet = Map.empty<Principal, ()>();
    switch (likes.get(caller)) {
      case (null) {};
      case (?existing) { likedSet := existing };
    };
    if (hasAlreadyLiked(likedSet, target)) {
      Runtime.trap("Already liked this profile");
    };
    likedSet.add(target, ());
    likes.add(caller, likedSet);

    switch (likes.get(target)) {
      case (null) {};
      case (?targetLikes) {
        let isMatch = switch (targetLikes.get(caller)) {
          case (?()) { true };
          case (null) { false };
        };
        if (isMatch) {
          var matchedSet = Map.empty<Principal, ()>();
          switch (matches.get(caller)) {
            case (null) { matchedSet.add(target, ()); matches.add(caller, matchedSet) };
            case (?existing) {
              if (not isAlreadyMatched(existing, target)) {
                existing.add(target, ());
              };
            };
          };
          var targetMatchedSet = Map.empty<Principal, ()>();
          switch (matches.get(target)) {
            case (null) { targetMatchedSet.add(caller, ()); matches.add(target, targetMatchedSet) };
            case (?matchedSet) {
              if (not isAlreadyMatched(matchedSet, caller)) {
                matchedSet.add(caller, ());
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func passProfile(target : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can pass profiles");
    };
  };

  public query ({ caller }) func getMatches() : async [Profile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view matches");
    };
    switch (matches.get(caller)) {
      case (null) { [] };
      case (?matchesSet) {
        matchesSet.keys().toArray().map(
          func(matched) { getProfileInternal(matched) }
        );
      };
    };
  };

  // Profiles management
  public query ({ caller }) func getProfile(user : Principal) : async Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    getProfileInternal(user);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getCallerProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let updatedProfile : Profile = {
      profile with
      photo = profile.photo;
      membershipTier = #basic;
      membershipExpiry = 0;
    };

    profiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func saveCallerProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let updatedProfile : Profile = {
      profile with
      photo = profile.photo;
      membershipTier = #basic;
      membershipExpiry = 0;
    };

    profiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func saveCallerProfilePhoto(photo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profile photos");
    };

    let existingProfile = getProfileInternal(caller);
    let updatedProfile = { existingProfile with photo = ?photo };
    profiles.add(caller, updatedProfile);
  };

  // Membership
  func isMembershipActive(profile : Profile) : Bool {
    profile.membershipExpiry > Time.now();
  };

  public query ({ caller }) func getMembershipPlans() : async [(Text, Nat)] {
    [("basic", 2000), ("premium", 9900), ("gold", 29900)];
  };

  // Stripe
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func createMembershipCheckoutSession(tier : Text, successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase memberships");
    };
    let (planText, price) = switch (tier) {
      case ("basic") { ("Basic", 2000) };
      case ("premium") { ("Premium", 9900) };
      case ("gold") { ("Gold", 29900) };
      case (_) { Runtime.trap("Invalid tier") };
    };
    let item : Stripe.ShoppingItem = {
      currency = "inr";
      productName = planText # " Membership - DilSe Dating";
      productDescription = "Access to premium star-rated dating service";
      priceInCents = price;
      quantity = 1;
    };

    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, [item], successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func activateMembership(user : Principal, tier : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can activate memberships");
    };
    let profile = getProfileInternal(user);
    let membershipTier = switch (tier) {
      case ("basic") { #basic };
      case ("premium") { #premium };
      case ("gold") { #gold };
      case (_) { Runtime.trap("Invalid tier") };
    };
    let updatedProfile = {
      profile with
      membershipTier;
      membershipExpiry = Time.now() + 30 * 24 * 60 * 60 * 1_000_000_000;
    };
    profiles.add(user, updatedProfile);
  };

  public query ({ caller }) func getMembershipStatus(user : Principal) : async (MembershipTier, Time.Time, Bool) {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own membership status");
    };
    let profile = getProfileInternal(user);
    (profile.membershipTier, profile.membershipExpiry, isMembershipActive(profile));
  };

  public query ({ caller }) func getProfilesWithoutPhotos() : async [Profile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access this function");
    };
    profiles.values().toArray().filter(
      func(profile) { profile.photo == null }
    );
  };
};
