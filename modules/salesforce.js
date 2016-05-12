"use strict";

let nforce = require('nforce'),

    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD,

    org = nforce.createConnection({
        clientId: SF_CLIENT_ID,
        clientSecret: SF_CLIENT_SECRET,
        redirectUri: 'http://localhost:3000/oauth/_callback',
        mode: 'single',
        autoRefresh: true
    });

let login = () => {

    org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD}, err => {
        if (err) {
            console.error("Authentication error");
            console.error(err);
        } else {
            console.log("Authentication successful");
        }
    });

};

let findAccount = name => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Phone, BillingStreet, BillingCity, BillingState FROM Account WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

let findContact = name => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Phone, MobilePhone, Email FROM Contact WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

let findOpportunity = name => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate FROM Opportunity WHERE Name LIKE '%" + name + "%' ORDER BY amount DESC LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

let getTopOpportunities = count => {

    count = count || 5;

    return new Promise((resolve, reject) => {
        var q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate FROM Opportunity WHERE isClosed=false ORDER BY amount DESC LIMIT " + count;
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

let createContact = contact => {

    return new Promise((resolve, reject) => {
        let c = nforce.createSObject('Contact');
        c.set('firstName', contact.firstName);
        c.set('lastName', contact.lastName);
        c.set('title', contact.title);
        c.set('phone', contact.phone);
        org.insert({sobject: c}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a contact");
            } else {
                resolve(c);
            }
        });
    });

};

let createQuote = quote => {

    return new Promise((resolve, reject) => {
        let c = nforce.createSObject('Apttus_Proposal__Proposal__c');
        c.set('name', quote.name);
        c.set('priceList', quote.Apttus_QPConfig__PriceListId__c);
        c.set('closeDate', quote.Close_Date__c);
        c.set('status', 'New');

        org.insert({sobject: c}, err => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating the quote");
            } else {
                resolve(c);
            }
        });
    });

};


let createAgreement = agreement => {

    return new Promise((resolve, reject) => {
        let c = nforce.createSObject('Apttus__APTS_Agreement__c');
        c.set('name', agreement.name);
        c.set('startDate', agreement.startDate);
        c.set('closeDate', agreement.closeDate);
        c.set('status', 'New');

        org.insert({sobject: c}, err => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating an agreement");
            } else {
                resolve(c);
            }
        });
    });

};

let createCase = newCase => {

    return new Promise((resolve, reject) => {
        let c = nforce.createSObject('Case');
        c.set('subject', newCase.subject);
        c.set('description', newCase.description);
        c.set('origin', 'Slack');
        c.set('status', 'New');

        org.insert({sobject: c}, err => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a case");
            } else {
                resolve(c);
            }
        });
    });

};



/* let createIsr = isr => {

    return new Promise((resolve, reject) => {
        let c = nforce.createSObject('ISR');
        c.set('number', isr.number);
        c.set('startDate', isr.startDate);
        c.set('closeDate', isr.closeDate);
        c.set('type', isr.type);
        c.set('activity', isr.type);

                org.insert({sobject: c}, err => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a ISR");
            } else {
                resolve(c);
            }
        });
    });
};
*/
login();

exports.org = org;
exports.findAccount = findAccount;
exports.findContact = findContact;
exports.findOpportunity = findOpportunity;
exports.getTopOpportunities = getTopOpportunities;
exports.createContact = createContact;
exports.createAgreement = createAgreement;
exports.createQuote = createQuote;
exports.createCase = createCase;