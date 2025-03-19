export const contact = async (formData) => {

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
        console.log("contact api result:", result);
        return result;
    } catch (error) {
      console.error("Error with contact api:", error);
    }
};
