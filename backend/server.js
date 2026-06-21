import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

// Enable CORS so your frontend can talk to your backend safely
app.use(cors());
app.use(express.json());

// The LeetCode GraphQL Endpoint
const LEETCODE_API_URL = 'https://leetcode.com/graphql';

app.get('/api/v1/leetcode/:username', async (req, res) => {
    const { username } = req.params;

    // The GraphQL query exactly asking for what stats we want
    const query = `
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch(LEETCODE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
            },
            body: JSON.stringify({
                query: query,
                variables: { username: username }
            })
        });

        const data = await response.json();

        if (!data.data.matchedUser) {
            return res.status(404).json({ error: 'User not found on LeetCode.' });
        }

        // Send the clean structured data back to the frontend
        res.json(data.data.matchedUser);

    } catch (error) {
        console.error('Backend Error:', error);
        res.status(500).json({ error: 'Failed to fetch data from LeetCode.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});