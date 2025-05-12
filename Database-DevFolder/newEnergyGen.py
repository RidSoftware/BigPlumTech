import random

output_file = "energyhourly_inserts.sql"

with open(output_file, "w") as f:
    for day in range(1, 32):  # May 1 to May 31
        for hour in range(24):  # 0 to 23 hours
            base_energy = 1.2 + (hour * 0.1)
            energy_val = base_energy + random.uniform(-0.05, 0.05)

            # Boost energy for 7 PM – 11 PM (19:00–23:00)
            if 19 <= hour <= 23:
                energy_val *= 1.15

            energy_val = round(energy_val, 2)
            date_str = f"2025-05-{day:02d}"

            sql = (
                f"INSERT INTO energyhourly (DeviceID, EnergyVal, Hour, Date) "
                f"VALUES (1, {energy_val}, {hour}, '{date_str}');\n"
            )
            f.write(sql)

print(f"SQL insert queries saved to {output_file}")

