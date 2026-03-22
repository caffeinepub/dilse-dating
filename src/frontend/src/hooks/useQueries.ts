import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Profile } from "../backend";
import { useActor } from "./useActor";

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDiscoverProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile[]>({
    queryKey: ["discoverProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOppositeGenderProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMatches() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMembershipPlans() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, bigint]>>({
    queryKey: ["membershipPlans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMembershipPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useSaveProfilePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photoBlob: import("../backend").ExternalBlob) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerProfilePhoto(photoBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useCreateMembershipSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      tier,
      successUrl,
      cancelUrl,
    }: {
      tier: string;
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createMembershipCheckoutSession(tier, successUrl, cancelUrl);
    },
  });
}
