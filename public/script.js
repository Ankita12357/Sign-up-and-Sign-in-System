

document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch("http://localhost:3000/register", {
      method: "POST",
      crossDomain: true,
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          fname,
          lname,
          email,
          password,
      }),
  })
  .then((res) => res.json())
  .then((data) => {
      console.log(data, "userRegister");
      if (data.status === "ok") {
          alert("Registration successful!");
      } 
      else if(data.status==="errorr"){
        alert("User already exists");
      }
      else {
          alert("Registration failed! Please try again.");
      }
  })
  .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
  });
});
