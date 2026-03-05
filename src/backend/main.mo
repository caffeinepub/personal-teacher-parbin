import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
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
    completedLessons : [(Nat, Text, Text)]; // (class, subject, lesson title)
    quizScores : [(Nat, Text, Nat)]; // (class, subject, score)
  };

  public type UserProfile = {
    name : Text;
    classNum : Nat;
  };

  // Persistent data structures
  type PersistentLesson = List.List<Lesson>;
  type PersistentQuiz = List.List<QuizQuestion>;

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

  // Persistent Map for lessons
  let lessonsStorePersistent = Map.empty<NatTextTuple.Tuple, PersistentLesson>();

  // Persistent Map for quizzes
  let quizStorePersistent = Map.empty<NatTextTuple.Tuple, PersistentQuiz>();

  // Persistent List for doubts
  let doubtsStorePersistent = List.empty<Doubt>();

  // Persistent Map for user progress
  let progressStorePersistent = Map.empty<Principal, Progress>();

  // Persistent Map for user profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Tuple comparison for (Nat, Text, Text)
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

  // Tuple comparison for (Nat, Text, Nat) for quiz scores
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

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get subjects for a class (public access)
  public query ({ caller }) func getSubjects(classNum : Nat) : async [Text] {
    if (classNum < 1 or classNum > 12) { Runtime.trap("Invalid class number") };
    ["Maths", "Science", "English", "Hindi", "Social Science", "Computer"];
  };

  // Add lesson (admin only)
  public shared ({ caller }) func addLesson(classNum : Nat, subject : Text, lesson : Lesson) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add lessons");
    };

    let key = (classNum, subject);
    let currentLessons = switch (lessonsStorePersistent.get(key)) {
      case (?lessons) { lessons };
      case (null) { List.empty<Lesson>() };
    };
    currentLessons.add(lesson);
    lessonsStorePersistent.add(key, currentLessons);
  };

  // Get lessons for a class+subject (public access)
  public query ({ caller }) func getLessons(classNum : Nat, subject : Text) : async [Lesson] {
    switch (lessonsStorePersistent.get((classNum, subject))) {
      case (?lessons) { lessons.toArray() };
      case (null) { [] };
    };
  };

  // Add quiz question (admin only)
  public shared ({ caller }) func addQuizQuestion(classNum : Nat, subject : Text, question : QuizQuestion) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add quiz questions");
    };

    let key = (classNum, subject);
    let currentQuestions = switch (quizStorePersistent.get(key)) {
      case (?questions) { questions };
      case (null) { List.empty<QuizQuestion>() };
    };
    currentQuestions.add(question);
    quizStorePersistent.add(key, currentQuestions);
  };

  // Get quiz questions for a class+subject (public access)
  public query ({ caller }) func getQuizQuestions(classNum : Nat, subject : Text) : async [QuizQuestion] {
    switch (quizStorePersistent.get((classNum, subject))) {
      case (?questions) { questions.toArray() };
      case (null) { [] };
    };
  };

  // Mark lesson as completed (user only)
  public shared ({ caller }) func completeLesson(classNum : Nat, subject : Text, lessonTitle : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete lessons");
    };

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

  // Get completed lessons for user (user only)
  public query ({ caller }) func getCompletedLessons() : async [(Nat, Text, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get completed lessons");
    };

    switch (progressStorePersistent.get(caller)) {
      case (?progress) { progress.completedLessons };
      case (null) { [] };
    };
  };

  // Submit quiz score (user only)
  public shared ({ caller }) func submitQuizScore(classNum : Nat, subject : Text, score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit quiz scores");
    };

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

  // Get quiz scores for user (user only)
  public query ({ caller }) func getQuizScores() : async [(Nat, Text, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get quiz scores");
    };

    switch (progressStorePersistent.get(caller)) {
      case (?progress) { progress.quizScores };
      case (null) { [] };
    };
  };

  // Submit doubt (user only)
  public shared ({ caller }) func submitDoubt(studentName : Text, classNum : Nat, subject : Text, question : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit doubts");
    };

    let newDoubt = {
      studentName;
      classNum;
      subject;
      question;
      answer = null;
    };
    doubtsStorePersistent.add(newDoubt);
  };

  // Answer doubt (admin only)
  public shared ({ caller }) func answerDoubt(index : Nat, answer : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can answer doubts");
    };

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

  // Get all doubts (admin only)
  public query ({ caller }) func getAllDoubts() : async [Doubt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all doubts");
    };
    doubtsStorePersistent.toArray();
  };

  // Get doubts by class+subject (public access - educational content)
  public query ({ caller }) func getDoubtsByClassSubject(classNum : Nat, subject : Text) : async [Doubt] {
    doubtsStorePersistent.toArray().filter(
      func(doubt) {
        doubt.classNum == classNum and doubt.subject == subject
      }
    );
  };

  // Get unanswered doubts (admin only)
  public query ({ caller }) func getUnansweredDoubts() : async [Doubt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get unanswered doubts");
    };
    doubtsStorePersistent.toArray().filter(func(doubt) { doubt.answer == null });
  };
};
