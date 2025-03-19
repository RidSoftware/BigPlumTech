//user apis

//
//      cleanly -- registers a new user.
//      expects newUser object in this form
//      vvvvvvvvvvvvvvvvvvvvvvvvvv
//      {
//          firstname: string,
//          lastname: string,
//          email: string,
//          password: string,
//          userType: "homeManager" | "homeUser"
//      }
//      vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
export const registerUser = async (newUser) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const result = await response.json();
      console.log("Registration API response:", result);
      return result;
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

//
// very simple login api
export const loginUser = async (email, password) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    // Update localStorage with the logged-in user data
    localStorage.setItem("user", JSON.stringify(result.user));
    console.log("User logged in successfully:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// fetches all users (i dont need for this other than testing ig)
export const getUsers = async () => {
  try {
    const response = await fetch("/users", { method: "GET" });
    const result = await response.json();
    console.log("Fetched users:", result);
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};





///////////////////////
export const updateUser = async (user) => {
  try {
    if (!user.userID) {
      console.error("UserID is required for updating user");
      return { success: false, message: "UserID is required" };
    }

    // Retrieve existing user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    // Merge provided data with stored data (fallback for missing fields)
    const updatedUser = {
      userID: user.userID, // Mandatory
      firstname: user.firstname ?? storedUser.firstname,
      surname: user.surname ?? storedUser.Surname,
      email: user.email ?? storedUser.Email,
    };

    // Ensure at least one field (firstname, surname, email) is provided
    if (!updatedUser.firstname && !updatedUser.surname && !updatedUser.email) {
      console.error("At least one of firstname, surname, or email is required");
      return { success: false, message: "At least one field (firstname, surname, email) is required" };
    }

    const response = await fetch("/api/updateUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    const result = await response.json();
    console.log("Update User API response:", result);
    return result;

  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Request failed" };
  }
};
