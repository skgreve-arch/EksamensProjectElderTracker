import 'package:flutter/material.dart';
import '../core/services/socket_service.dart';
import '../core/services/api_service.dart';

class SocketProvider extends ChangeNotifier 
{
  final SocketService _socketService = SocketService();
  final ApiService _apiService = ApiService();

  Map<String, dynamic>? latestAlarm;
  Map<String, dynamic>? alarmResident;
  bool isLoadingResident = false;

  SocketProvider() 
  {
    _socketService.onAlarm = (data) async
    {
      latestAlarm = data;
      isLoadingResident = true;
      notifyListeners();

      try 
      {
        alarmResident = await _apiService.getResidentByTracker(data['Tracker_ID']);
      } 
      catch (e) 
      {
        alarmResident = null;
      }
      finally 
      {
        isLoadingResident = false;
        notifyListeners();
      }
    };
    _socketService.connect();
  }
  
  void clearAlarm() 
  {
    latestAlarm = null;
    alarmResident = null;
    notifyListeners();
  }

  @override
  void dispose() 
  {
    _socketService.dispose();
    super.dispose();
  }
}