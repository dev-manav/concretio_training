@isTest
public class userDataMock implements HttpCalloutMock {

    private List<HttpResponse> responses;

    public userDataMock(List<HttpResponse> responses) {
        this.responses = responses;
    }

    public HttpResponse respond(HttpRequest request) {
        //
        if (responses.isEmpty()) {
            return new HttpResponse(); // Return a default response or throw an exception
        }
        HttpResponse nextResponse = responses.remove(0);
        return nextResponse;
    }
}