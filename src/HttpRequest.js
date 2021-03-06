'use strict';

const rp = require('request-promise-native');
const StandardError = require('@unplgtc/standard-error');

const HttpRequest = {
	get payload() {
		return {
			...(this.options != null && this.options),
			...(this.url != null     && { url: this.url         }),
			...(this.headers != null && { headers: this.headers }),
			...(this.body != null    && { body: this.body       }),
			...(this.json != null    && { json: this.json       }),
			...(this.qs != null      && { qs: this.qs           }),
			...(this.resolveWithFullResponse != null && { 
				resolveWithFullResponse: this.resolveWithFullResponse 
			})
		}
	},

	create() {
		return Object.create(this);
	},

	build(data = {}) {
		const {url, headers, body, json, qs, resolveWithFullResponse, ...options} = data;

		url != null     && (this.url = url);
		headers != null && (this.headers = headers);
		body != null    && (this.body = body);
		json != null    && (this.json = json);
		qs != null      && (this.qs = qs);
		resolveWithFullResponse != null && (this.resolveWithFullResponse = resolveWithFullResponse);

		Object.keys(options).length > 0 && (this.options = options);

		return this;
	},

	setUrl(url) {
		this.url = url;
		return this;
	},

	setHeader(key, value) {
		if (!this.headers) {
			this.headers = {};
		}
		this.headers[key] = value;
		return this;
	},

	setHeaders(headers) {
		this.headers = headers;
		return this;
	},

	setBody(body) {
		this.body = body;
		return this;
	},

	setJson(json) {
		this.json = json;
		return this;
	},

	setResolveWithFullResponse(resolveWithFullResponse) {
		this.resolveWithFullResponse = resolveWithFullResponse;
		return this;
	},

	setQs(qs) {
		this.qs = qs;
		return this;
	},

	setOption(key, value) {
		return this.build({
			...(this.options != null && this.options), 
			[key]: value 
		});
	},

	setOptions(options) {
		this.options = {};
		// set native fields first, then options
		return this.build(options);
	}
}

const HttpRequestExecutor = {
	get(payload = this.payload) {
		return this.execute('get', payload);
	},

	post(payload = this.payload) {
		return this.execute('post', payload);
	},

	put(payload = this.payload) {
		return this.execute('put', payload);
	},

	delete(payload = this.payload) {
		return this.execute('delete', payload);
	},

	execute(method, payload = this.payload) {
		if (!Object.keys(payload).length || !payload.url) {
			return Promise.reject(StandardError.HttpRequestExecutor_400());
		} else {
			return rp[method](payload);
		}
	}
}

StandardError.add([
	{code: 'HttpRequestExecutor_400', domain: 'HttpRequest', title: 'Bad Request', message: 'Cannot execute HttpRequest with empty payload or url'}
]);

// Delegate from HttpRequest to HttpRequestExecutor
Object.setPrototypeOf(HttpRequest, HttpRequestExecutor);

module.exports = HttpRequest;
