/// A simple class to hold the current user's information in memory.
/// This is a very basic implementation and is not secure or persistent. In a real application, you would likely want to use a more robust solution for managing user sessions and authentication state, such as a state management library or secure storage. 
/// For the purposes of this application, `CurrentUser` serves as a simple way to store the logged-in user's ID and name after a successful login, allowing other parts of the app to access this information without needing to pass it around explicitly.
/// Note: This class does not handle logout or token expiration, and it should not be used in production without additional security measures.
class CurrentUser {
  static int? userId;
  static String? name;
}
