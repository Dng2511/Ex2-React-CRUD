import { Http } from "./Http";

const BASE = "/users";
export const Api = {
	getUsers: async () => {
		try {
			const res = await Http.get(BASE);
			return res.data;
		} catch (err) {
			throw err;
		}
	},
	getUser: async (id) => {
		try {
			const res = await Http.get(`${BASE}/${id}`);
			return res.data;
		} catch (err) {
			throw err;
		}
	},
	createUser: async (user) => {
		try {
			const res = await Http.post(BASE, user);
			return res.data;
		} catch (err) {
			throw err;
		}
	},
	updateUser: async (id, user) => {
		try {
			const res = await Http.put(`${BASE}/${id}`, user);
			return res.data;
		} catch (err) {
			throw err;
		}
	},
	deleteUser: async (id) => {
		try {
			const res = await Http.delete(`${BASE}/${id}`);
			return res.data;
		} catch (err) {
			throw err;
		}
	}
};
