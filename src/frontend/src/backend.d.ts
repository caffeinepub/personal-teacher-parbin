import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Doubt {
    question: string;
    studentName: string;
    subject: string;
    answer?: string;
    classNum: bigint;
}
export interface Lesson {
    title: string;
    description: string;
    pdfUrl: string;
    notes: string;
    videoUrl: string;
}
export interface UserProfile {
    name: string;
    classNum: bigint;
}
export interface QuizQuestion {
    question: string;
    correctIndex: bigint;
    options: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLesson(classNum: bigint, subject: string, lesson: Lesson): Promise<void>;
    addQuizQuestion(classNum: bigint, subject: string, question: QuizQuestion): Promise<void>;
    answerDoubt(index: bigint, answer: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeLesson(classNum: bigint, subject: string, lessonTitle: string): Promise<void>;
    getAllDoubts(): Promise<Array<Doubt>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompletedLessons(): Promise<Array<[bigint, string, string]>>;
    getDoubtsByClassSubject(classNum: bigint, subject: string): Promise<Array<Doubt>>;
    getLessons(classNum: bigint, subject: string): Promise<Array<Lesson>>;
    getQuizQuestions(classNum: bigint, subject: string): Promise<Array<QuizQuestion>>;
    getQuizScores(): Promise<Array<[bigint, string, bigint]>>;
    getSubjects(classNum: bigint): Promise<Array<string>>;
    getUnansweredDoubts(): Promise<Array<Doubt>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDoubt(studentName: string, classNum: bigint, subject: string, question: string): Promise<void>;
    submitQuizScore(classNum: bigint, subject: string, score: bigint): Promise<void>;
}
