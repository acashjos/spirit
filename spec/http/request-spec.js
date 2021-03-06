const request = require("../../lib/http/request")

describe("http request", () => {

  let mock_req = {
    connection: { remoteAddress: "74.125.127.100" },
    headers: {
      host: "localhost:3009"
    },
    httpVersion: "1.1",
    method: "GET",
    url: "/hello"
  }

  describe("host & port", () => {
    it("sets host (string) and port (number)", () => {
      const rmap = {}
      request.hostport(mock_req, rmap)
      expect(rmap).toEqual({
        host: "localhost",
        port: 3009
      })
    })

    it("supports ipv6 hosts and port", () => {
      const rmap = {}
      mock_req.headers.host = "[2620:10d:c021:11::75]"
      request.hostport(mock_req, rmap)
      expect(rmap).toEqual({
        host: "[2620:10d:c021:11::75]"
      })

      mock_req.headers.host = "[2620:10d:c021:11::75]:8000"
      request.hostport(mock_req, rmap)
      expect(rmap).toEqual({
        host: "[2620:10d:c021:11::75]",
        port: 8000
      })
    })
  })

  describe("urlquery", () => {
    it("sets the url and defaults query to {} when no query found", () => {
      const rmap = {}
      request.urlquery(mock_req, rmap)
      expect(rmap.url).toBe("/hello")
      expect(typeof rmap.query).toBe("object")
      expect(Object.keys(rmap.query).length).toBe(0)
    })

    it("sets query as an object and keeps original url as url", () => {
      const rmap = {}
      mock_req.url = "/p/a/t/h?hi=test#hash"
      request.urlquery(mock_req, rmap)
      expect(rmap.url).toBe("/p/a/t/h?hi=test#hash")
      expect(rmap.query.hi).toBe("test")
    })
  })

  describe("protocol", () => {
    it("defaults to http", () => {
      const rmap = {}
      request.protocol(mock_req, rmap)
      expect(rmap.protocol).toBe("http")
    })

    it("flags as https if req.connection.encrypted exists", () => {
      const rmap = {}
      mock_req.connection.encrypted = true
      request.protocol(mock_req, rmap)
      expect(rmap.protocol).toBe("https")
    })
  })

  describe("create", () => {
    it("request map", () => {
      let mock_req = {
        connection: { remoteAddress: "74.125.127.100" },
        headers: {
          host: "localhost:3009"
        },
        httpVersion: "1.1",
        method: "POST",
        url: "/hello?a=1"
      }

      const result = request.create(mock_req)
      expect(result.port).toBe(3009)
      expect(result.host).toBe("localhost")
      expect(result.ip).toBe("74.125.127.100")
      expect(result.url).toBe("/hello?a=1")
      expect(result.method).toBe("POST")
      expect(result.scheme).toBe("1.1")
      expect(result.protocol).toBe("http")
      expect(result.headers).toBe(mock_req.headers)
      //expect(result.body).toBe(mock_req)
      expect(result.req()).toBe(mock_req)
      expect(result.query.a).toBe("1")

      expect(Object.keys(result).length).toBe(10)
    })

    it("passes method, httpVersion, headers of req", () => {
      const result = request.create(mock_req)
      expect(result.headers).toBe(mock_req.headers)
      expect(result.scheme).toBe("1.1")
      expect(result.method).toBe("GET")
    })

  })

})
