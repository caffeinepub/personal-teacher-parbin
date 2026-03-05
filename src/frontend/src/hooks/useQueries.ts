import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Doubt, Lesson, Poll, QuizQuestion } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetSubjects(classNum: number) {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["subjects", classNum],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubjects(BigInt(classNum));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLessons(classNum: number, subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Lesson[]>({
    queryKey: ["lessons", classNum, subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLessons(BigInt(classNum), subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useGetQuizQuestions(classNum: number, subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<QuizQuestion[]>({
    queryKey: ["quiz", classNum, subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuizQuestions(BigInt(classNum), subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useGetDoubtsByClassSubject(classNum: number, subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Doubt[]>({
    queryKey: ["doubts", classNum, subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDoubtsByClassSubject(BigInt(classNum), subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useGetCompletedLessons() {
  const { actor, isFetching } = useActor();
  return useQuery<[bigint, string, string][]>({
    queryKey: ["completedLessons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCompletedLessons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQuizScores() {
  const { actor, isFetching } = useActor();
  return useQuery<[bigint, string, bigint][]>({
    queryKey: ["quizScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuizScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCompleteLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classNum,
      subject,
      lessonTitle,
    }: {
      classNum: number;
      subject: string;
      lessonTitle: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.completeLesson(BigInt(classNum), subject, lessonTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completedLessons"] });
    },
  });
}

export function useSubmitDoubt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentName,
      classNum,
      subject,
      question,
    }: {
      studentName: string;
      classNum: number;
      subject: string;
      question: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitDoubt(
        studentName,
        BigInt(classNum),
        subject,
        question,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["doubts", variables.classNum, variables.subject],
      });
    },
  });
}

export function useSubmitQuizScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classNum,
      subject,
      score,
    }: {
      classNum: number;
      subject: string;
      score: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitQuizScore(BigInt(classNum), subject, BigInt(score));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizScores"] });
    },
  });
}

// ─── Admin Queries & Mutations ─────────────────────────────────────────────────

// Extended actor type to include the authorization init method
type ActorWithInit = ReturnType<typeof useActor>["actor"] & {
  _initializeAccessControlWithSecret?: (userSecret: string) => Promise<void>;
};

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (err) {
        // If user is not registered yet, isCallerAdmin() traps with "User is not registered"
        // Return null to indicate unregistered state (distinct from false = registered non-admin)
        const msg = String(err);
        if (
          msg.includes("User is not registered") ||
          msg.includes("not registered")
        ) {
          return null as unknown as boolean;
        }
        throw err;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export function useInitializeWithSecret() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (userSecret: string) => {
      if (!actor) throw new Error("Actor not available");
      const actorWithInit = actor as ActorWithInit;
      if (!actorWithInit._initializeAccessControlWithSecret) {
        throw new Error("Initialization method not available");
      }
      return actorWithInit._initializeAccessControlWithSecret(userSecret);
    },
    onSuccess: () => {
      // Invalidate isAdmin so it re-fetches after registration
      queryClient.invalidateQueries({
        queryKey: ["isAdmin", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useGetAllDoubts() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Doubt[]>({
    queryKey: ["allDoubts", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDoubts();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetUnansweredDoubts() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Doubt[]>({
    queryKey: ["unansweredDoubts", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnansweredDoubts();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classNum,
      subject,
      lesson,
    }: {
      classNum: number;
      subject: string;
      lesson: Lesson;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addLesson(BigInt(classNum), subject, lesson);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lessons", variables.classNum, variables.subject],
      });
    },
  });
}

export function useAddQuizQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classNum,
      subject,
      question,
    }: {
      classNum: number;
      subject: string;
      question: QuizQuestion;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addQuizQuestion(BigInt(classNum), subject, question);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["quiz", variables.classNum, variables.subject],
      });
    },
  });
}

export function useGetPolls(classNum: number, subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Poll[]>({
    queryKey: ["polls", classNum, subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPolls(BigInt(classNum), subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useAddPoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classNum,
      subject,
      pollData,
    }: {
      classNum: number;
      subject: string;
      pollData: { question: string; options: string[] };
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPoll(BigInt(classNum), subject, pollData);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["polls", variables.classNum, variables.subject],
      });
    },
  });
}

export function useVotePoll() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classNum,
      subject,
      pollIndex,
      optionIndex,
    }: {
      classNum: number;
      subject: string;
      pollIndex: number;
      optionIndex: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.votePoll(
        BigInt(classNum),
        subject,
        BigInt(pollIndex),
        BigInt(optionIndex),
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["polls", variables.classNum, variables.subject],
      });
    },
  });
}

export function useAnswerDoubt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      index,
      answer,
    }: {
      index: number;
      answer: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.answerDoubt(BigInt(index), answer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allDoubts"] });
      queryClient.invalidateQueries({ queryKey: ["unansweredDoubts"] });
    },
  });
}
