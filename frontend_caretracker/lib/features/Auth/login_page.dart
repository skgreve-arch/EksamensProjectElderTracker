import 'package:flutter/material.dart';
import '../../shared/current_user.dart';
import '../../core/services/api_service.dart';
import '../../home_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final ApiService api = ApiService();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

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

              TextField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'Email'),
              ),

              const SizedBox(height: 15),

              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: 'Password'),
              ),

              const SizedBox(height: 30),

              ElevatedButton(
                onPressed: () async {
                  try {
                    final user = await api.login(
                      emailController.text,
                      passwordController.text,
                    );

                    if (user != null) {
                      CurrentUser.userId = user['User_ID'];
                      CurrentUser.name = user['Name'];

                      print('Logged in as ${CurrentUser.name}');
                      print('User ID ${CurrentUser.userId}');

                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const HomePage()),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Invalid login')),
                      );
                    }
                  } catch (e) {
                    print(e);
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
