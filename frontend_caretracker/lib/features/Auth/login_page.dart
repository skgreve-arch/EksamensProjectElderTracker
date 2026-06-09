import 'package:flutter/material.dart';
import '../../shared/current_user.dart';
import '../../core/services/api_service.dart';
import '../../home_page.dart';

/// Simple login page for the CareTrack application.
///
/// Uses [ApiService] to authenticate and writes basic user info into
/// `CurrentUser` on success. The page is intentionally minimal and relies
/// on `Navigator.pushReplacement` to move to the home screen after login.
class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  /// API client used for authentication requests.
  final ApiService api = ApiService();

  /// Controller for the email text field.
  final emailController = TextEditingController();

  /// Controller for the password text field.
  final passwordController = TextEditingController();

  @override
  void dispose() {
    // Dispose controllers to avoid memory leaks.
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SizedBox(
          width: 400,

          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,

            children: [
              const Text(
                'CareTrack Login',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
              ),

              const SizedBox(height: 30),

              // Email input
              TextField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'Email'),
              ),

              const SizedBox(height: 15),

              // Password input
              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Password'),
              ),

              const SizedBox(height: 30),

              // Login button
              ElevatedButton(
                onPressed: () async {
                  // Attempt to authenticate with provided credentials.
                  try {
                    final user = await api.login(
                      emailController.text,
                      passwordController.text,
                    );

                    if (user != null) {
                      // Store minimal user info for global access
                      CurrentUser.userId = user['User_ID'];
                      CurrentUser.name = user['Name'];

                      // Debug: log to console (remove or replace with logger)
                      print('Logged in as ${CurrentUser.name}');
                      print('User ID ${CurrentUser.userId}');

                      // Navigate to home and remove login from the stack
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const HomePage()),
                      );
                    } else {
                      // Show a brief error for invalid credentials
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Invalid login')),
                      );
                    }
                  } catch (e) {
                    // Network or unexpected error - log and show feedback
                    print(e);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Login failed. Try again.')),
                    );
                  }
                },
                child: const Text('Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
