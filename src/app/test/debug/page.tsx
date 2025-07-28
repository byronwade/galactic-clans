"use client";

export default function DebugPage() {
	const handleButtonClick = (destination: string) => {
		console.log(`Attempting to navigate to: ${destination}`);
		alert(`Navigating to: ${destination}`);
		window.location.href = destination;
	};

	return (
		<div style={{ padding: '20px', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
			<h1 style={{ color: '#fff', marginBottom: '20px' }}>Debug Button Test</h1>
			
			<div style={{ marginBottom: '20px' }}>
				<h2>Navigation Test Buttons</h2>
				<p>These buttons should work regardless of CSS styling issues:</p>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
				<button 
					onClick={() => handleButtonClick('/test/audio')}
					style={{
						padding: '10px 20px',
						backgroundColor: '#0066cc',
						color: '#fff',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
						pointerEvents: 'auto'
					}}
				>
					→ Audio Test
				</button>

				<button 
					onClick={() => handleButtonClick('/test/planet')}
					style={{
						padding: '10px 20px',
						backgroundColor: '#0066cc',
						color: '#fff',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
						pointerEvents: 'auto'
					}}
				>
					→ Planet Test
				</button>

				<button 
					onClick={() => handleButtonClick('/test/galaxy')}
					style={{
						padding: '10px 20px',
						backgroundColor: '#0066cc',
						color: '#fff',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
						pointerEvents: 'auto'
					}}
				>
					→ Galaxy Test
				</button>

				<button 
					onClick={() => handleButtonClick('/test')}
					style={{
						padding: '10px 20px',
						backgroundColor: '#cc6600',
						color: '#fff',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
						pointerEvents: 'auto'
					}}
				>
					← Back to Main Test
				</button>
			</div>

			<div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#333', borderRadius: '5px' }}>
				<h3>Debug Info:</h3>
				<p>• Current URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
				<p>• Click a button and check the console and alert</p>
				<p>• These buttons use inline styles and should bypass any CSS issues</p>
			</div>
		</div>
	);
} 