import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

module {
  // Type Definitions
  type Lesson = {
    title : Text;
    description : Text;
    videoUrl : Text;
    notes : Text;
  };

  type OldQuizQuestion = {
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

  type OldProgress = {
    completedLessons : [(Nat, Text, Text)];
    quizScores : [(Nat, Text, Nat)];
  };

  type PersistentLesson = List.List<Lesson>;
  type PersistentQuiz = List.List<OldQuizQuestion>;

  module NatTextTuple {
    public type Tuple = (Nat, Text);
    public func compare(a : Tuple, b : Tuple) : Order.Order {
      switch (Nat.compare(a.0, b.0)) {
        case (#equal) { Text.compare(a.1, b.1) };
        case (other) { other };
      };
    };
  };

  module Tuple3 {
    public type Tuple = (Nat, Text, Text);
    public func compare(a : Tuple, b : Tuple) : Order.Order {
      switch (Nat.compare(a.0, b.0)) {
        case (#equal) {
          switch (Text.compare(a.1, b.1)) {
            case (#equal) { Text.compare(a.2, b.2) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  module Tuple3Score {
    public type Tuple = (Nat, Text, Nat);
    public func compare(a : Tuple, b : Tuple) : Order.Order {
      switch (Nat.compare(a.0, b.0)) {
        case (#equal) {
          switch (Text.compare(a.1, b.1)) {
            case (#equal) { Nat.compare(a.2, b.2) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  type OldActor = {
    lessonsStorePersistent : Map.Map<NatTextTuple.Tuple, PersistentLesson>;
    quizStorePersistent : Map.Map<NatTextTuple.Tuple, PersistentQuiz>;
    doubtsStorePersistent : List.List<Doubt>;
    progressStorePersistent : Map.Map<Principal, OldProgress>;
  };

  // New definitions for user profiles and lessons
  public type UserProfile = {
    name : Text;
    classNum : Nat;
  };

  type PersistentNewLesson = List.List<NewLesson>;
  type PersistentNewQuiz = List.List<NewQuizQuestion>;

  type NewLesson = {
    title : Text;
    description : Text;
    videoUrl : Text;
    pdfUrl : Text;
    notes : Text;
  };

  type NewQuizQuestion = {
    question : Text;
    options : [Text];
    correctIndex : Nat;
  };

  type NewProgress = {
    completedLessons : [(Nat, Text, Text)];
    quizScores : [(Nat, Text, Nat)];
  };

  type NewActor = {
    lessonsStorePersistent : Map.Map<NatTextTuple.Tuple, PersistentNewLesson>;
    quizStorePersistent : Map.Map<NatTextTuple.Tuple, PersistentNewQuiz>;
    doubtsStorePersistent : List.List<Doubt>;
    progressStorePersistent : Map.Map<Principal, NewProgress>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    // Convert persistent lesson data (only add empty pdfUrl for now since it cannot be covered by automatic migration)
    let newLessonsStore = old.lessonsStorePersistent.map<NatTextTuple.Tuple, PersistentLesson, PersistentNewLesson>(
      func(_key, oldLessonList) {
        let oldLessonsArray = oldLessonList.toArray();
        let transformedLessonsArray = oldLessonsArray.map(
          func(oldLesson) {
            {
              oldLesson with
              pdfUrl = "";
            };
          }
        );
        List.fromArray(transformedLessonsArray);
      }
    );

    {
      lessonsStorePersistent = newLessonsStore;
      quizStorePersistent = old.quizStorePersistent;
      doubtsStorePersistent = old.doubtsStorePersistent;
      progressStorePersistent = old.progressStorePersistent;
      userProfiles = Map.empty<Principal, UserProfile>();
    };
  };
};
