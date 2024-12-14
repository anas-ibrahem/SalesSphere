const LoadingScreen = () => {
    return (
        <div className="loading-screen"
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: 'white'
        }}
        >
        <img src="/LoadingSalesSphere.gif" alt="Company Logo" style={
        {
            width: '200px',
        }
        }/>
        </div>
    );
}

export default LoadingScreen;