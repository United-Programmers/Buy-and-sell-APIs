const sgMail = require('@sendgrid/mail')
const API_KEY = process.env.SENDGRID_PASSWORD

//* Email Verification
exports.EmailVerify = async (verifyURL, newUser) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: newUser.email,
        from: process.env.EMAIL_FORM,
        subject: `Verify Email`,
        text: "something",
        html: `
            <h3> From Tutoring </h3>
            <h5> Hi ${newUser.firstName} ${newUser.lastName}, </h5>
            <p>We're happy you signed up for Tutoring. To start using our platform please confirm your email address.</p>
            <button style="background:#3630a3;color:white;">  Click here : <a href="${verifyURL}"> Verify Now </a>  </button>
    `}
    sgMail.send(message)
        .then(response => { console.log("email verify : ", response) })
        .catch(err => { console.log("email verify : ", err.message) })
}
//* End

//* Email Verification
exports.ApproveLecturer = async (newUser) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: process.env.EMAIL_FORM,
        from: newUser.email,
        subject: `Approve lecturer`,
        text: "something",
        html: `
            <h3> Hello, ${process.env.EMAIL_FORM} I want to become a tutor on your platform </h3>
            <p>  Click here : <a href="${process.env.FRONT_END_URL}"> Get inside the system and approve </a>  </p>
    `}
    sgMail.send(message)
        .then(response => { console.log("email verify : ", response) })
        .catch(err => { console.log("email verify : ", err.message) })
}
//* End


//* Forget Email
exports.forgetEmail = async (resetURL, email) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: email,
        from: process.env.EMAIL_FORM,
        subject: `Password Reset`,
        text: "Hi From Tours",
        html: `
        <h2> Hi, ${email} click on the link bellow to reset your password </h2>
        <p>  Click here : <a href="${resetURL}"> ${resetURL} </a>  </p>
    `}
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End

//* Forget Email
exports.updatePasswordEmail = async (user, password) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: user.email,
        from: process.env.EMAIL_FORM,
        subject: `Your Password have been updated`,
        text: "Hi From Tours",
        html: `
        <h2> Hi, ${user.firstName} ${user.lastName}your password have been updated </h2>
        <p>  Your Email is : ${user.email}  </p>
        <p>  Your New Password is : ${password}  </p>
        <p>  Click on this Link to Login <a href="${process.env.FRONT_END_URL}login">  ${process.env.FRONT_END_URL} </a></p>
    `}
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End


//* Suspended Email
exports.Suspended = async (email, name) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: email,
        from: process.env.EMAIL_FORM,
        subject: `Your have been suspended`,
        text: "Hi From Security check in",
        html: `
        <h2> Hi, ${name} You have been suspended from accessing the system </h2>
        <p>  Use this email ${process.env.EMAIL_FORM} To find out about the suspension thanks. </p>
    `}
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End

//* Un-Suspended Email
exports.UnSuspended = async (email, name) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: email,
        from: process.env.EMAIL_FORM,
        subject: `Your have been Un-suspended`,
        text: "Hi From Security check in",
        html: `
        <h2> Hi, ${name} You are unsuspended, now you have full access to the system. </h2>
        <p>  Click on this Link to access the system <a href="${process.env.FRONT_END_URL}login">  ${process.env.FRONT_END_URL} </a></p>
    `}
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End


//* Approved Email
exports.Approved = async (email, name) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: email,
        from: process.env.EMAIL_FORM,
        subject: `Your have been Approved`,
        text: "Hi From Tutoring",
        html: `
        <h2> Hi, ${name} You have been approved to teach on our Platform. </h2>
        <p>  Click on this Link to access the system <a href="${process.env.FRONT_END_URL}login">  ${process.env.FRONT_END_URL} </a></p>
    `}
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End

//* Declined Email
exports.Declined = async (email, name) => {
    sgMail.setApiKey(API_KEY);
    const message = {
        to: email,
        from: process.env.EMAIL_FORM,
        subject: `Your have been Declined`,
        text: "Hi From Tutoring",
        html: `
        <h2> Hi, ${name}, Thank you for applying at tutoring.com, your request was declined, try again after 6 months </h2>
        <p>  Click on this Link to access the system <a href="${process.env.FRONT_END_URL}login">  ${process.env.FRONT_END_URL} </a></p>
    `}
    sgMail.send(message)
        .then(response => { console.log(response) })
        .catch(err => { console.log(err.message) })
}
//* End

