import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Doubt, Lesson, QuizQuestion } from "../backend.d";
import { useActor } from "./useActor";

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
