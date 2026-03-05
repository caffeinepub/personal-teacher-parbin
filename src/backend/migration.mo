import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Text "mo:core/Text";

module {
  type OldLesson = {
    title : Text;
    description : Text;
    videoUrl : Text;
    pdfUrl : Text;
    notes : Text;
  };

  type OldQuizQuestion = {
    question : Text;
    options : [Text];
    correctIndex : Nat;
  };

  type OldDoubt = {
    studentName : Text;
    classNum : Nat;
    subject : Text;
    question : Text;
    answer : ?Text;
  };

  type OldProgress = {
    completedLessons : [(Nat, Text, Text)];
    quizScores : [(Nat, Text, Nat)];
  };

  type OldUserProfile = {
    name : Text;
    classNum : Nat;
  };

  type OldPoll = {
    question : Text;
    options : [Text];
    classNum : Nat;
    subject : Text;
    votes : [Nat];
  };

  type PersistentOldLesson = List.List<OldLesson>;
  type PersistentOldQuiz = List.List<OldQuizQuestion>;

  // Tuple comparison for (Nat, Text)
  module NatTextTuple {
    public type Tuple = (Nat, Text);
    public func compare(a : Tuple, b : Tuple) : Order.Order {
      switch (Nat.compare(a.0, b.0)) {
        case (#equal) { Text.compare(a.1, b.1) };
        case (other) { other };
      };
    };
  };

  type OldActor = {
    lessonsStorePersistent : Map.Map<NatTextTuple.Tuple, PersistentOldLesson>;
    quizStorePersistent : Map.Map<NatTextTuple.Tuple, PersistentOldQuiz>;
    doubtsStorePersistent : List.List<OldDoubt>;
    progressStorePersistent : Map.Map<Principal, OldProgress>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    pollStorePersistent : Map.Map<NatTextTuple.Tuple, List.List<OldPoll>>;
  };

  type NewLesson = {
    title : Text;
    description : Text;
    videoUrl : Text;
    shortVideoUrl : Text; // New fields
    longVideoUrl : Text;
    pdfUrl : Text;
    notes : Text;
  };

  type NewQuizQuestion = OldQuizQuestion;
  type NewDoubt = OldDoubt;
  type NewProgress = OldProgress;
  type NewUserProfile = OldUserProfile;
  type NewPoll = OldPoll;
  type PersistentNewLesson = List.List<NewLesson>;
  type PersistentNewQuiz = List.List<NewQuizQuestion>;

  type NewActor = {
    lessonsStorePersistent : Map.Map<NatTextTuple.Tuple, PersistentNewLesson>;
    quizStorePersistent : Map.Map<NatTextTuple.Tuple, PersistentNewQuiz>;
    doubtsStorePersistent : List.List<NewDoubt>;
    progressStorePersistent : Map.Map<Principal, NewProgress>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    pollStorePersistent : Map.Map<NatTextTuple.Tuple, List.List<NewPoll>>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newLessons = old.lessonsStorePersistent.map<NatTextTuple.Tuple, PersistentOldLesson, PersistentNewLesson>(
      func(_, oldLessons) {
        oldLessons.map<OldLesson, NewLesson>(
          func(oldLesson) {
            {
              oldLesson with
              videoUrl = oldLesson.videoUrl;
              shortVideoUrl = ""; // Default empty, admin must fill via update
              longVideoUrl = oldLesson.videoUrl; // Default to original video - admin should correct if needed
            };
          }
        );
      }
    );
    {
      old with lessonsStorePersistent = newLessons : Map.Map<NatTextTuple.Tuple, PersistentNewLesson>;
    };
  };
};
