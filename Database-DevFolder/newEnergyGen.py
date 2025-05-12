import random

output_file = "energyhourly_inserts.sql"

with open(output_file, "w") as f:
    for day in range(1, 32):  # May 1 to 31
        for hour in range(24):  # 0 to 23
            if 0 <= hour <= 5:
                energy_val = random.uniform(0.3, 0.6)
            elif 6 <= hour <= 10:
                energy_val = random.uniform(0.6, 1.2)
            elif 11 <= hour <= 17:
                energy_val = random.uniform(0.8, 1.5)
            elif 18 <= hour <= 20:
                energy_val = random.uniform(1.4, 2.0)
            else:  # 21–23
                energy_val = random.uniform(1.2, 1.8)

            energy_val = round(energy_val, 2)
            date_str = f"2025-05-{day:02d}"

            sql = (
                f"INSERT INTO energyhourly (DeviceID, EnergyVal, Hour, Date) "
                f"VALUES (1, {energy_val}, {hour}, '{date_str}');\n"
            )
            f.write(sql)

print(f"SQL insert queries saved to {output_file}")

