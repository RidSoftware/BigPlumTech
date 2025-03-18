for day in range(17, 19):
    for hour in range(24):
        print(f"INSERT INTO energyhourly (DeviceID, EnergyVal, Hour, Date) VALUES (3, {1.2 + (hour * 0.1)}, {hour}, '2025-03-{day}');")