import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";

module {
  type Lesson = {
    title : Text;
    description : Text;
    videoUrl : Text;
    pdfUrl : Text;
    notes : Text;
  };

  type QuizQuestion = {
    question : Text;
    options : [Text];
    correctIndex : Nat;
  };

  type Doubt = {
    studentName : Text;
    classNum : Nat;
    subject : Text;
    question : Text;
    answer : ?Text;
  };

  type Progress = {
    completedLessons : [(Nat, Text, Text)];
    quizScores : [(Nat, Text, Nat)];
  };

  type UserProfile = {
    name : Text;
    classNum : Nat;
  };

  type Poll = {
    question : Text;
    options : [Text];
    classNum : Nat;
    subject : Text;
    votes : [Nat];
  };

  type PersistentLesson = List.List<Lesson>;
  type PersistentQuiz = List.List<QuizQuestion>;

  // old actor without pollStore
  type OldActor = {
    lessonsStorePersistent : Map.Map<(Nat, Text), PersistentLesson>;
    quizStorePersistent : Map.Map<(Nat, Text), PersistentQuiz>;
    doubtsStorePersistent : List.List<Doubt>;
    progressStorePersistent : Map.Map<Principal, Progress>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewActor = {
    lessonsStorePersistent : Map.Map<(Nat, Text), PersistentLesson>;
    quizStorePersistent : Map.Map<(Nat, Text), PersistentQuiz>;
    doubtsStorePersistent : List.List<Doubt>;
    progressStorePersistent : Map.Map<Principal, Progress>;
    userProfiles : Map.Map<Principal, UserProfile>;
    pollStorePersistent : Map.Map<(Nat, Text), List.List<Poll>>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      pollStorePersistent = Map.empty<(Nat, Text), List.List<Poll>>();
    };
  };
};
