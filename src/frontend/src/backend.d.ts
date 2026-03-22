import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Profile {
    age: bigint;
    bio: string;
    displayName: string;
    membershipExpiry: Time;
    interests: Array<string>;
    city: string;
    gender: Gender;
    photo?: ExternalBlob;
    membershipTier: MembershipTier;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum MembershipTier {
    premium = "premium",
    gold = "gold",
    basic = "basic"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activateMembership(user: Principal, tier: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createMembershipCheckoutSession(tier: string, successUrl: string, cancelUrl: string): Promise<string>;
    getCallerProfile(): Promise<Profile | null>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMatches(): Promise<Array<Profile>>;
    getMembershipPlans(): Promise<Array<[string, bigint]>>;
    getMembershipStatus(user: Principal): Promise<[MembershipTier, Time, boolean]>;
    getOppositeGenderProfiles(): Promise<Array<Profile>>;
    getProfile(user: Principal): Promise<Profile>;
    getProfilesByGender(gender: Gender): Promise<Array<Profile>>;
    getProfilesWithoutPhotos(): Promise<Array<Profile>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    likeProfile(target: Principal): Promise<void>;
    passProfile(target: Principal): Promise<void>;
    saveCallerProfile(profile: Profile): Promise<void>;
    saveCallerProfilePhoto(photo: ExternalBlob): Promise<void>;
    saveCallerUserProfile(profile: Profile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
