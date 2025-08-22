export default function LogoutPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Logged Out</h1>
      <p>You have been successfully logged out.</p>
      <a 
        href="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block',
          marginTop: '20px'
        }}
      >
        Go Home
      </a>
    </div>
  );
}