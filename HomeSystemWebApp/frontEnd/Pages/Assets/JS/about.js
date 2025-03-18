document.addEventListener("DOMContentLoaded", function () {
    const teamWrapper = document.querySelector(".team-wrapper");
    const teamMembers = document.querySelectorAll(".team-member");

    if (!teamWrapper || teamMembers.length === 0) return; // Stop if no team section exists

    // Duplicate team members to create infinite scrolling effect
    teamMembers.forEach(member => {
        let clone = member.cloneNode(true);
        teamWrapper.appendChild(clone);
    });
});
