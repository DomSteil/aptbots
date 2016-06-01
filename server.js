"use strict";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

let Botkit = require('botkit'),
    formatter = require('./modules/slack-formatter'),
    salesforce = require('./modules/salesforce'),

    controller = Botkit.slackbot(),

    bot = controller.spawn({
        token: SLACK_BOT_TOKEN
    });

bot.startRTM(err => {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});


controller.hears(['help'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, {
        text: `Hello there, my name is Aptbot. You can ask me to do Salesforce and Apttus things like:
    "Search account Acme" or "Search Acme in acccounts"
    "Search contact Lisa Smith" or "Search Lisa Smith in contacts"
    "Search opportunity Big Deal"
    "Create contact"
    "Create case"
    "Create Quote"
    "Create Agreement"
    "Log ISR"`
    });
});


controller.hears(['search account (.*)', 'search (.*) in accounts'], 'direct_message,direct_mention,mention', (bot, message) => {
    let name = message.match[1];
    salesforce.findAccount(name)
        .then(accounts => bot.reply(message, {
            text: "I found these accounts matching  '" + name + "':",
            attachments: formatter.formatAccounts(accounts)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['search contact (.*)', 'find contact (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    let name = message.match[1];
    salesforce.findContact(name)
        .then(contacts => bot.reply(message, {
            text: "I found these contacts matching  '" + name + "':",
            attachments: formatter.formatContacts(contacts)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['top (.*) deals', 'top (.*) opportunities'], 'direct_message,direct_mention,mention', (bot, message) => {
    let count = message.match[1];
    salesforce.getTopOpportunities(count)
        .then(opportunities => bot.reply(message, {
            text: "Here are your top " + count + " opportunities:",
            attachments: formatter.formatOpportunities(opportunities)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['search opportunity (.*)', 'find opportunity (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {

    let name = message.match[1];
    salesforce.findOpportunity(name)
        .then(opportunities => bot.reply(message, {
            text: "I found these opportunities matching  '" + name + "':",
            attachments: formatter.formatOpportunities(opportunities)
        }))
        .catch(error => bot.reply(message, error));

});

controller.hears(['create case', 'new case'], 'direct_message,direct_mention,mention', (bot, message) => {

    let subject,
        description;

    let askSubject = (response, convo) => {

        convo.ask("What's the subject?", (response, convo) => {
            subject = response.text;
            askDescription(response, convo);
            convo.next();
        });

    };

    let askDescription = (response, convo) => {

        convo.ask('Enter a description for the case', (response, convo) => {
            description = response.text;
            salesforce.createCase({subject: subject, description: description})
                .then(_case => {
                    bot.reply(message, {
                        text: "I created the case:",
                        attachments: formatter.formatCase(_case)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askSubject);

});

controller.hears(['create contact', 'new contact'], 'direct_message,direct_mention,mention', (bot, message) => {

    let firstName,
        lastName,
        title,
        phone,
        email;

    let askFirstName = (response, convo) => {

        convo.ask("What's the first name?", (response, convo) => {
            firstName = response.text;
            askLastName(response, convo);
            convo.next();
        });

    };

    let askLastName = (response, convo) => {

        convo.ask("What's the last name?", (response, convo) => {
            lastName = response.text;
            askTitle(response, convo);
            convo.next();
        });

    };

    let askTitle = (response, convo) => {

        convo.ask("What's the title?", (response, convo) => {
            title = response.text;
            askPhone(response, convo);
            convo.next();
        });

    };

    let askPhone = (response, convo) => {

        convo.ask("What's the phone number?", (response, convo) => {
            phone = response.text;
            convo.next();
        });

    };

    let askEmail = (response, convo) => {

        convo.ask("What's the email", (repsonse, convo) => {
            email = response.text;
            salesforce.createContact({firstName: firstName, lastName: lastName, title: title, phone: phone, email: email})
                .then(contact => {
                    bot.reply(message, {
                        text: "I created the contact:",
                        attachments: formatter.formatContact(contact)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askFirstName);

});

controller.hears(['Create quote', 'new quote', 'Quote', 'New proposal', 'Create proposal'], 'direct_message,direct_mention,mention', (bot, message) => {

    let name,
        opportunityName,
        priceList;

    let askQuoteName = (response, convo) => {

        convo.ask("What's the Quote name?", (response, convo) => {
            name = response.text;
            askOpportunityName(response, convo);
            convo.next();
        });

    };

    let askOpportunityName = (response, convo) => {

        convo.ask("What's the Opportunity name?", (repsonse, convo) => {
            opportunityName = response.text;
            askPriceList(response, convo);
            convo.next();
        });
    }

    let askPriceList = (response, convo) => {

        convo.ask("Which Price List?", (response, convo) => {
            priceList = response.text;
            salesforce.createQuote({name: name, opportunityName: opportunityName, priceList: priceList})
                .then(quote => {
                    bot.reply(message, {
                        text: "I created the quote:",
                        attachments: formatter.formatQuote(quote)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askQuoteName);

});

controller.hears(['create agreement', 'new agreement', 'create contract', 'new contract', 'agreement'], 'direct_message,direct_mention,mention', (bot, message) => {

    let name,
        startDate,
        closeDate,
        status;

    let askAgreementName = (response, convo) => {

        convo.ask("What's the contract name?", (response, convo) => {
            name = response.text;
            askStartDate(response, convo);
            convo.next();
        });

    };

    let askStartDate = (response, convo) => {

        convo.ask("What's the Start Date?", (response, convo) => {
            startDate = response.text;
            askCloseDate(response, convo);
            convo.next();
        });

    };

    let askCloseDate = (response, convo) => {

        convo.ask("What's the Close Date?", (response, convo) => {
            closeDate = response.text;
            askStatus(response, convo);
            convo.next();
        });

    };

    let askStatus = (response, convo) => {

        convo.ask("What's the status?", (response, convo) => {
            status = response.text;
            salesforce.createAgreement({Name: name, startDate: startDate, closeDate: closeDate, status: status})
                .then(agreement => {
                    bot.reply(message, {
                        text: "I created the agreement:",
                        attachments: formatter.formatAgreement(agreement)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askAgreementName);

});

controller.hears(['New NDA', 'Create NDA', 'NDA'], 'direct_message,direct_mention,mention', (bot, message) => {

    let account,
        contact;

    let askAgreementAccount = (response, convo) => {

        convo.ask("Which Account?", (response, convo) => {
            account = response.text;
            askContact(response, convo);
            convo.next();
        });

    };

    let askContact = (response, convo) => {

        convo.ask("Who should I send it to?", (response, convo) => {
            contact = response.text;
            salesforce.createNDA({Account: account, contact: contact})
                .then(nda => {
                    bot.reply(message, {
                        text: "I created the NDA and send it to contact:",
                        attachments: formatter.formatAgreement(agreement)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askAgreementAccount);

});


controller.hears(['create ISR', 'new ISR', 'log ISR', ], 'direct_message,direct_mention,mention', (bot, message) => {

    let isr,
        start,
        end,
        type,
        activity;

    let askIsrNumber = (response, convo) => {

        convo.ask("What's the ISR number?", (response, convo) => {
            isr = response.text;
            askStart(response, convo);
            convo.next();
        });

    };

    let askStart = (response, convo) => {

        convo.ask("What was the Start time?", (response, convo) => {
            start = response.text;
            askClose(response, convo);
            convo.next();
        });

    };

    let askClose = (response, convo) => {

        convo.ask("When did you finish?", (response, convo) => {
            end = response.text;
            askType(response, convo);
            convo.next();
        });

    };

     let askType = (response, convo) => {

        convo.ask("What type of event?", (response, convo) => {
            type = response.text;
            askActivity(response, convo);
            convo.next();
        });

    };


    let askActivity = (response, convo) => {

        convo.ask("What type of activity?", (response, convo) => {
            activity = response.text;
            salesforce.createIsr({isr: isr, start: start, end: end, type: type, activity: activity})
                .then(_isr=> {
                    bot.reply(message, {
                        text: "I created the ISR:",
                        attachments: formatter.formatIsr(isr)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, I can help you with that!");
    bot.startConversation(message, askIsrNumber);

});

