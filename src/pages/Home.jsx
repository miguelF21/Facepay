import biometric from '../assets/biometric.jpg';

function Home() {
  return (
    <div className="text-center">
      <h1>Payface</h1>
      <p className="lead">Automated attendance and payroll management using facial recognition.</p>
      <img src={biometric} alt="Biometric Recognition" width="300" className="img-fluid" />
    </div>
  );
}

export default Home;
