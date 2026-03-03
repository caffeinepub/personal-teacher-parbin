import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

actor {
  // Type Definitions
  type Lesson = {
    title : Text;
    description : Text;
    videoUrl : Text;
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
    completedLessons : [(Nat, Text, Text)]; // (class, subject, lesson title)
    quizScores : [(Nat, Text, Nat)]; // (class, subject, score)
  };

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

  // Persistent Data Structures
  let lessonsStorePersistent = Map.empty<NatTextTuple.Tuple, List.List<Lesson>>();
  let quizStorePersistent = Map.empty<NatTextTuple.Tuple, List.List<QuizQuestion>>();

  // Persistent lists for doubtsStore (no persistent List<List<List<...>>> exists)
  let doubtsStorePersistent = List.empty<Doubt>();

  // Persistent Map for progressStore
  let progressStorePersistent = Map.empty<Principal, Progress>();

  // Module for tuple comparison
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

  // Tuple comparison for (Nat, Text, Nat)
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

  public query ({ caller }) func getSubjects(classNum : Nat) : async [Text] {
    if (classNum < 1 or classNum > 12) { Runtime.trap("Invalid class number") };
    ["Maths", "Science", "English", "Hindi", "Social Science", "Computer"];
  };

  public shared ({ caller }) func addLesson(classNum : Nat, subject : Text, lesson : Lesson) : async () {
    let key = (classNum, subject);
    let currentLessons = switch (lessonsStorePersistent.get(key)) {
      case (?lessons) { lessons };
      case (null) { List.empty<Lesson>() };
    };
    currentLessons.add(lesson);
    lessonsStorePersistent.add(key, currentLessons);
  };

  public query ({ caller }) func getLessons(classNum : Nat, subject : Text) : async [Lesson] {
    switch (lessonsStorePersistent.get((classNum, subject))) {
      case (?lessons) { lessons.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addQuizQuestion(classNum : Nat, subject : Text, question : QuizQuestion) : async () {
    let key = (classNum, subject);
    let currentQuestions = switch (quizStorePersistent.get(key)) {
      case (?questions) { questions };
      case (null) { List.empty<QuizQuestion>() };
    };
    currentQuestions.add(question);
    quizStorePersistent.add(key, currentQuestions);
  };

  public query ({ caller }) func getQuizQuestions(classNum : Nat, subject : Text) : async [QuizQuestion] {
    switch (quizStorePersistent.get((classNum, subject))) {
      case (?questions) { questions.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func completeLesson(classNum : Nat, subject : Text, lessonTitle : Text) : async () {
    let userProgress = switch (progressStorePersistent.get(caller)) {
      case (?progress) { progress };
      case (null) {
        {
          completedLessons = [];
          quizScores = [];
        };
      };
    };

    let updatedCompleted = userProgress.completedLessons.concat([(classNum, subject, lessonTitle)]);
    let sortedCompleted = updatedCompleted.sort();

    let updatedProgress = {
      userProgress with
      completedLessons = sortedCompleted;
    };
    progressStorePersistent.add(caller, updatedProgress);
  };

  public query ({ caller }) func getCompletedLessons() : async [(Nat, Text, Text)] {
    switch (progressStorePersistent.get(caller)) {
      case (?progress) { progress.completedLessons };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func submitQuizScore(classNum : Nat, subject : Text, score : Nat) : async () {
    let userProgress = switch (progressStorePersistent.get(caller)) {
      case (?progress) { progress };
      case (null) {
        {
          completedLessons = [];
          quizScores = [];
        };
      };
    };

    let updatedScores = userProgress.quizScores.concat([(classNum, subject, score)]);
    let sortedScores = updatedScores.sort();

    let updatedProgress = {
      userProgress with
      quizScores = sortedScores;
    };
    progressStorePersistent.add(caller, updatedProgress);
  };

  public query ({ caller }) func getQuizScores() : async [(Nat, Text, Nat)] {
    switch (progressStorePersistent.get(caller)) {
      case (?progress) { progress.quizScores };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func submitDoubt(studentName : Text, classNum : Nat, subject : Text, question : Text) : async () {
    let newDoubt = {
      studentName;
      classNum;
      subject;
      question;
      answer = null;
    };
    doubtsStorePersistent.add(newDoubt);
  };

  public shared ({ caller }) func answerDoubt(index : Nat, answer : Text) : async () {
    if (index >= doubtsStorePersistent.size()) { Runtime.trap("Doubt index out of bounds") };
    let doubtsArray = doubtsStorePersistent.toArray();
    let updatedArray = Array.tabulate(
      doubtsArray.size(),
      func(i) {
        if (i == index) {
          let doubt = doubtsArray[index];
          {
            doubt with answer = ?answer;
          };
        } else {
          doubtsArray[i];
        };
      },
    );
    doubtsStorePersistent.clear();
    doubtsStorePersistent.addAll(updatedArray.values());
  };

  public query ({ caller }) func getAllDoubts() : async [Doubt] {
    doubtsStorePersistent.toArray();
  };

  public query ({ caller }) func getDoubtsByClassSubject(classNum : Nat, subject : Text) : async [Doubt] {
    doubtsStorePersistent.toArray().filter(
      func(doubt) {
        doubt.classNum == classNum and doubt.subject == subject
      }
    );
  };

  public query ({ caller }) func getUnansweredDoubts() : async [Doubt] {
    doubtsStorePersistent.toArray().filter(func(doubt) { doubt.answer == null });
  };

  system func preupgrade() {
    // No additional state to persist
  };

  system func postupgrade() {
    // Pre-populate demo content for Class 6
    let class6Maths = (6, "Maths");
    let class6Science = (6, "Science");

    // Lessons
    let mathsLessons = List.empty<Lesson>();
    mathsLessons.add(
      {
        title = "Fractions";
        description = "Introduction to fractions";
        videoUrl = "pending";
        notes = "Fractions represent parts of a whole.";
      },
    );
    mathsLessons.add(
      {
        title = "Decimals";
        description = "Understanding decimals";
        videoUrl = "pending";
        notes = "Decimals are another way to represent parts of a whole.";
      },
    );

    let scienceLessons = List.empty<Lesson>();
    scienceLessons.add(
      {
        title = "Food Habits";
        description = "Types of food habits";
        videoUrl = "pending";
        notes = "Animals and humans have different food habits.";
      },
    );
    scienceLessons.add(
      {
        title = "Living and Non-living";
        description = "Difference between living and non-living things";
        videoUrl = "pending";
        notes = "Characteristics that distinguish living from non-living things.";
      },
    );

    lessonsStorePersistent.add(class6Maths, mathsLessons);
    lessonsStorePersistent.add(class6Science, scienceLessons);

    // Quiz Questions
    let mathsQuestions = List.empty<QuizQuestion>();
    mathsQuestions.add(
      {
        question = "What is 1/2 as a decimal?";
        options = ["0.2", "0.5", "0.8", "1.2"];
        correctIndex = 1;
      },
    );
    mathsQuestions.add(
      {
        question = "Which is a proper fraction?";
        options = ["3/3", "5/5", "2/5", "9/9"];
        correctIndex = 2;
      },
    );

    let scienceQuestions = List.empty<QuizQuestion>();
    scienceQuestions.add(
      {
        question = "What do herbivores eat?";
        options = ["Fruits", "Vegetables", "Meat", "Bugs"];
        correctIndex = 1;
      },
    );
    scienceQuestions.add(
      {
        question = "Which is living?";
        options = ["Rock", "Car", "Tree", "Phone"];
        correctIndex = 2;
      },
    );

    quizStorePersistent.add(class6Maths, mathsQuestions);
    quizStorePersistent.add(class6Science, scienceQuestions);
  };
};
