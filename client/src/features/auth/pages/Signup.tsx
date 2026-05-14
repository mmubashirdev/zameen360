function Signup(){
  return (
    <>
      <h1>Signup Page</h1>
      <form>
        <label htmlFor="fullName">Full Name</label>
        <input type="text" id="fullName" />
        <label htmlFor="email">Email</label>
        <input type="email" />
        <label htmlFor="phoneNumber">Phone Number</label>
        <input type="tel" />
      </form>
    </>
  )
}

export default Signup;