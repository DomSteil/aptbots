"use strict";

let color = "#009cdb";

let formatAccounts = accounts => {

    if (accounts && accounts.length>0) {
        let attachments = [];
        accounts.forEach(account => {
            let fields = [];
            fields.push({title: "Name", value: account.get("Name"), short:true});
            fields.push({title: "Link", value: "https://login.salesforce.com/" + account.getId(), short:true});
            fields.push({title: "Phone", value: account.get("Phone"), short:true});
            fields.push({title: "Address", value: account.get("BillingStreet") + ", " + account.get("BillingCity") + " " + account.get("BillingState"), short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "No records"}];
    }

};

let formatContacts = contacts => {

    if (contacts && contacts.length>0) {
        let attachments = [];
        contacts.forEach(contact => {
            let fields = [];
            fields.push({title: "Name", value: contact.get("Name"), short:true});
            fields.push({title: "Link", value: "https://login.salesforce.com/" + contact.getId(), short:true});
            fields.push({title: "Phone", value: contact.get("Phone"), short:true});
            fields.push({title: "Mobile", value: contact.get("MobilePhone"), short:true});
            fields.push({title: "Email", value: contact.get("Email"), short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "No records"}];
    }

};

let formatContact = contact => {

    let fields = [];
    fields.push({title: "Name", value: contact.get("FirstName") + " " + contact.get("LastName"), short:true});
    fields.push({title: "Link", value: "https://login.salesforce.com/" + contact.getId(), short:true});
    fields.push({title: "Title", value: contact.get("Title"), short:true});
    fields.push({title: "Phone", value: contact.get("Phone"), short:true});
    return [{color: color, fields: fields}];

};

let formatOpportunities = opportunities => {

    if (opportunities && opportunities.length>0) {
        let attachments = [];
        opportunities.forEach(opportunity => {
            let fields = [];
            fields.push({title: "Opportunity", value: opportunity.get("Name"), short:true});
            fields.push({title: "Link", value: "https://login.salesforce.com/" + opportunity.getId(), short:true});
            fields.push({title: "Stage", value: opportunity.get("StageName"), short:true});
            fields.push({title: "Close Date", value: opportunity.get("CloseDate"), short:true});
            fields.push({title: "Amount", value: new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(opportunity.get("Amount")), short:true});
            fields.push({title: "Probability", value: opportunity.get("Probability") + "%", short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "No records"}];
    }

};

let formatCase = _case => {

    let fields = [];
    fields.push({title: "Subject", value: _case.get("subject"), short: true});
    fields.push({title: "Link", value: 'https://login.salesforce.com/' + _case.get("id"), short: true});
    fields.push({title: "Description", value: _case.get("description"), short: false});
    return [{color: color, fields: fields}];

};

let formatQuote = _quote => {

    let fields = [];
    fields.push({title: "Name", value: _quote.get("name"), short: true});
    fields.push({title: "Pricelist", value: _quote.get("priceList"), short: true});
    fields.push({title: "Close Date", value: _quote.get("closeDate"), short: false});
	fields.push({title: "Status", value: _quote.get("status"), short: false});
    return [{color: color, fields: fields}];

};

let formatAgreement = _agreement => {

    let fields = [];
    fields.push({title: "Name", value: _agreement.get("name"), short: true});
    fields.push({title: "Pricelist", value: _agreement.get("startDate"), short: true});
    fields.push({title: "Close Date", value: _agreement.get("closeDate"), short: false});
	fields.push({title: "Status", value: _agreement.get("status"), short: false});
    return [{color: color, fields: fields}];

};


let formatIsr = _isr => {

    let fields = [];
    fields.push({title: "Number", value: _isr.get("number"), short: true});
    fields.push({title: "Start Date", value: _isr.get("startDate"), short: true});
    fields.push({title: "Close Date", value: _isr.get("closeDate"), short: false});
    fields.push({title: "Type", value: _isr.get("type"), short: false});
    fields.push({title: "Activity", value: _isr.get("activity"), short: false});
    return [{color: color, fields: fields}];

};

exports.formatAccounts = formatAccounts;
exports.formatContacts = formatContacts;
exports.formatContact = formatContact;
exports.formatOpportunities = formatOpportunities;
exports.formatCase = formatCase;
exports.formatQuote = formatQuote;
exports.formatAgreement = formatAgreement;
exports.formartIsr = formatIsr;