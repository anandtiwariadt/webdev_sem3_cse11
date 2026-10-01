import { useState } from 'react';
import './apiTest.css';
function ApiTest() {
	const [method, setMethod] = useState('GET');
	const [url, setUrl] = useState('http://localhost:3000/user');
	const [requestBody, setRequestBody] = useState('');
	const [responseBody, setResponseBody] = useState('');
	const [statusCode, setStatusCode] = useState(null);
	const [loading, setLoading] = useState(false);

	const requiresBody = method === 'POST' || method === 'PUT';
	const isSuccessStatus =
		statusCode !== null && statusCode !== 'Error' && Number(statusCode) >= 200 && Number(statusCode) < 300;
	const statusButtonClass =
		statusCode === null
			? 'status-button neutral'
			: isSuccessStatus
				? 'status-button success'
				: 'status-button error';

	const [collections, setCollections] = useState([
		{
			id: 1,
			name: 'User APIs',
			requests: [
				{
					id: 1,
					name: 'Get Users',
					method: 'GET',
					url: 'http://localhost:3000/user',
					body: '',
				},
				{
					id: 2,
					name: 'Create User',
					method: 'POST',
					url: 'http://localhost:3000/create',
					body: '{\n  "name": "New User",\n  "email": "new@gmail.com"\n}',
				},
			],
		},
	]);

	const [selectedCollection, setSelectedCollection] = useState(null);

	async function sendRequest() {
		setLoading(true);
		setStatusCode(null);
		setResponseBody('');

		try {
			const options = { method };

			if (method !== 'GET' && requestBody.trim() !== '') {
				options.headers = { 'Content-Type': 'application/json' };
				options.body = requestBody;
			}

			const response = await fetch(url, options);
			const text = await response.text();

			let formattedResponse = text;

			try {
				const jsonData = JSON.parse(text);
				formattedResponse = JSON.stringify(jsonData, null, 2);
			} catch {
				formattedResponse = text;
			}

			setStatusCode(response.status);
			setResponseBody(formattedResponse);
		} catch (error) {
			setStatusCode('Error');
			setResponseBody(error.message);
		} finally {
			setLoading(false);
		}
	}

	function createCollection() {
		const name = window.prompt('Enter collection name:');

		if (!name || name.trim() === '') {
			return;
		}

		const newCollection = {
			id: Date.now(),
			name: name.trim(),
			requests: [],
		};

		setCollections((prevCollections) => [...prevCollections, newCollection]);
	}

	function saveRequest() {
		if (collections.length === 0) {
			window.alert('Create a collection first.');
			return;
		}

		const requestName = window.prompt('Enter request name:');

		if (!requestName || requestName.trim() === '') {
			return;
		}

		const collectionId = selectedCollection ?? collections[0].id;

		const newRequest = {
			id: Date.now(),
			name: requestName.trim(),
			method,
			url,
			body: requestBody,
		};

		setCollections((prevCollections) =>
			prevCollections.map((collection) =>
				collection.id === collectionId
					? { ...collection, requests: [...collection.requests, newRequest] }
					: collection,
			),
		);

		window.alert('Request saved successfully!');
	}

	function loadRequest(request) {
		setMethod(request.method);
		setUrl(request.url);
		setRequestBody(request.body || '');
		setResponseBody('');
		setStatusCode(null);
	}

	function deleteCollection(collectionId) {
		const confirmDelete = window.confirm('Delete this collection?');

		if (!confirmDelete) {
			return;
		}

		setCollections((prevCollections) => prevCollections.filter((collection) => collection.id !== collectionId));

		if (selectedCollection === collectionId) {
			setSelectedCollection(null);
		}
	}

	function deleteRequest(collectionId, requestId) {
		setCollections((prevCollections) =>
			prevCollections.map((collection) => {
				if (collection.id !== collectionId) {
					return collection;
				}

				return {
					...collection,
					requests: collection.requests.filter((request) => request.id !== requestId),
				};
			}),
		);
	}

	return (
		<section className="api-tester">
			<aside className="collections-sidebar">
				<div className="sidebar-header">
					<h2>Collections</h2>
					<button type="button" onClick={createCollection}>
						+
					</button>
				</div>

				<div className="collections-list">
					{collections.length === 0 && <p className="empty-message">No collections yet.</p>}

					{collections.map((collection) => (
						<div className="collection" key={collection.id}>
							<div
								className="collection-header"
								onClick={() => {
									if (selectedCollection === collection.id) {
										setSelectedCollection(null);
									} else {
										setSelectedCollection(collection.id);
									}
								}}
							>
								<span>📁</span>
								<span>{collection.name}</span>

								<button
									type="button"
									onClick={(event) => {
										event.stopPropagation();
										deleteCollection(collection.id);
									}}
								>
									🗑
								</button>
							</div>

							{selectedCollection === collection.id && (
								<div className="requests-list">
									{collection.requests.length === 0 && <p className="empty-request">No requests</p>}

									{collection.requests.map((request) => (
										<div className="saved-request" key={request.id}>
											<button
												type="button"
												className="request-name"
												onClick={() => loadRequest(request)}
											>
												<span className={`method-${request.method.toLowerCase()}`}>{request.method}</span>
												<span>{request.name}</span>
											</button>

											<button
												type="button"
												className="delete-request"
												onClick={() => deleteRequest(collection.id, request.id)}
											>
												×
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</aside>

			<main className="api-main">
				<div className="page-heading">
					<h1>API Tester</h1>
					<button type="button" onClick={saveRequest}>
						Save Request
					</button>
				</div>

				<div className="request-row">
					<select value={method} onChange={(event) => setMethod(event.target.value)}>
						<option>GET</option>
						<option>POST</option>
						<option>PUT</option>
						<option>DELETE</option>
					</select>

					<input
						type="url"
						value={url}
						onChange={(event) => setUrl(event.target.value)}
						placeholder="http://localhost:3000/user"
					/>

					<button type="button" onClick={sendRequest} disabled={loading}>
						{loading ? 'Sending...' : 'Send request'}
					</button>
				</div>

				{requiresBody && (
					<>
						<label htmlFor="request-body">Body</label>
						<textarea
							id="request-body"
							value={requestBody}
							onChange={(event) => setRequestBody(event.target.value)}
							placeholder={'{\n  "name": "New user",\n  "email": "new@example.com"\n}'}
							rows="6"
						/>
					</>
				)}

				<button className={statusButtonClass} type="button" disabled>
					Status: {statusCode ?? 'Not sent'}
				</button>

				<label htmlFor="response-body">Response</label>
				<pre id="response-body" className="response-box">
					{responseBody || 'The server response will appear here.'}
				</pre>
			</main>
		</section>
	);
}

export default ApiTest;
