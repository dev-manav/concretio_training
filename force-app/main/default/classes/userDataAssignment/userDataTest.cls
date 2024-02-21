/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class userDataTest {

    @isTest
    static void getUsersTest() {
        List<User> userList = userData.getUsers();
        System.assertEquals(userList.size(), 5);
    }
    
    @isTest
    static void getUsersbyName(){
        User usr = userData.getUsersbyName('Manav')[0];
        System.assertEquals('Manav Sharma', usr.Name);
    }
    
    @isTest
    static void passwordChangeTest(){
        List<HttpResponse> responses = new List<HttpResponse>();
        // Add response 1
        HttpResponse response1 = new HttpResponse();
        String res1 = '<?xml version="1.0" encoding="UTF-8"?>'+
             '<Message>ABCDE</Message>'+
             '<Error>ABCDE</Error>';
        response1.setStatusCode(200);
        response1.setBody(res1);
        String responseBody1 = response1.getBody();
        responses.add(response1);
        
        HttpResponse response2 = new HttpResponse();
        String res2 = '';
        response2.setStatusCode(-1);
        response2.setBody(res2);
        String responseBody2 = response2.getBody();
        responses.add(response2);
        
        Test.setMock(HttpCalloutMock.class, new userDataMock(responses));
        
        Test.startTest();
        userData.passwordChange('12344', '1234abcde');
        Test.stopTest();
    }
}