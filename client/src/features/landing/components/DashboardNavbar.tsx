import logo from '../../../assets/logo.png';

function DashboardNavbar(){
  return (
    <>
    <img src={logo} alt="logo" />
    <ul>
      <li>Home</li>
      <li>Buy</li>
      <li>Rent</li>
      <li>Sell</li>
      <li>Projects</li>
      <li>About Us</li>
      <li>Contact</li>
    </ul>
    <div>
      <button>Login</button>
      <button>Post Property</button>
    </div>
    </>
  )
}

export default DashboardNavbar;