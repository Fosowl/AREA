//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let { WidgetModel } = require('../models/widget');
const { http_status } = require('../utils/errors_handle');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let { faker } = require('@faker-js/faker');
let should = chai.should();
let expect = chai.expect();

chai.use(chaiHttp);

let token;
let widget;

//Our parent block
describe('Widgets', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     WidgetModel.remove({}, (err) => { 
    //         done();
    //     });
    // });

    const register_path = '/api/user/register';
    const login_path = '/api/user/login';
    const all_widget_path = '/api/widget';
    const add_widget_path = '/api/widget/add';
    const delete_widget_path = '/api/widget';

    const user_register_info = {
        pseudo: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }

    before((done) => {
        chai
            .request(server)
            .post(register_path)
            .send(user_register_info)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('user');
                token = res.body.user;
                done();
        });
    });

    after((done) => {
        mongoose.connection.dropDatabase(() => {
            console.log("Test Database dropped");

            mongoose.connection.close(() => {
                done();
            });
        });
    });


    /*
    * Test the /GET route
    */
    describe('/GET all widgets', () => {
        it('it should GET no widgets without Authorization', (done) => {
            chai
                .request(server)
                .get(all_widget_path)
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should GET 0 widgets because there is nothing', (done) => {
            chai
                .request(server)
                .get(all_widget_path)
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(http_status.OK);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('widgets');
                    res.body.data.widgets.should.be.a('array');
                    res.body.data.widgets.length.should.be.eql(0);
                    done();
                });
        });
    });


    /*
    * Test Add widget
    */
    describe('Add widget', () => {
        it('it should not add widget without Authorization', (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should not add widget without empty fields', (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                // .set('Content-Type: application/json', token)
                .send({})
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Missing 'action' object in 'request.body'")
                    done();
                });
        });

        it("it should not add widget without empty service field in 'action'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: { },
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Missing 'service' string in 'action' object")
                    done();
                });
        });

        it("it should not add widget without non-string service field in 'action'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: {},
                    },
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("'service' field in 'action' is not a string")
                    done();
                });
        });

        it("it should not add widget without empty event field in 'action'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "",
                    },
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Missing 'event' string in 'action' object")
                    done();
                });
        });

        it("it should not add widget without non-string event field in 'action'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "",
                        event: {}
                    },
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("'event' field in 'action' is not a string")
                    done();
                });
        });

        it("it should not add widget without correct service field name in 'action'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "dreheth",
                        event: ""
                    },
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Unknown Service 'dreheth'");
                    done();
                });
        });

        it("it should not add widget without correct event field name in 'action'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "djrky"
                    },
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Unknown action 'djrky'");
                    done();
                });
        });

        it("it should not add widget without empty service field in 'reaction'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "on_favorite"
                    },
                    reaction: { }
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Missing 'service' string in 'reaction' object")
                    done();
                });
        });

        it("it should not add widget without non-string service field in 'reaction'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "on_favorite"
                    },
                    reaction: {
                        service: {},
                    },
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("'service' field in 'reaction' is not a string")
                    done();
                });
        });

        it("it should not add widget without empty event field in 'reaction'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "on_favorite"
                    },
                    reaction: {
                        service: "",
                    }
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Missing 'event' string in 'reaction' object")
                    done();
                });
        });

        it("it should not add widget without non-string event field in 'reaction'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "on_favorite"
                    },
                    reaction: {
                        service: "",
                        event: {}
                    }
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("'event' field in 'reaction' is not a string")
                    done();
                });
        });

        it("it should not add widget without empty data field in 'reaction'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "on_favorite"
                    },
                    reaction: {
                        service: "",
                        event: ""
                    }
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Missing 'data' string in 'reaction' object")
                    done();
                });
        });

        it("it should not add widget without non-object data field in 'reaction'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "on_favorite"
                    },
                    reaction: {
                        service: "",
                        event: "",
                        data: true
                    }
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("'data' field in 'reaction' is not an object")
                    done();
                });
        });

        it("it should not add widget without correct service field name in 'reaction'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "on_favorite"
                    },
                    reaction: {
                        service: "dreheth",
                        event: "",
                        data: {}
                    }
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Unknown Service 'dreheth'")
                    done();
                });
        });

        it("it should not add widget without correct event field name in 'reaction'", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "on_favorite"
                    },
                    reaction: {
                        service: "twitter",
                        event: "djrky",
                        data: {}
                    }
                })
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.message.should.be.eql("Unknown reaction 'djrky'");
                    done();
                });
        });

        it("it should add widget with correct fields and OAuth", (done) => {
            chai
                .request(server)
                .post(add_widget_path)
                .set('Authorization', token)
                .send({
                    action: {
                        service: "twitter",
                        event: "on_favorite"
                    },
                    reaction: {
                        service: "twitter",
                        event: "send_tweet",
                        data: {
                            text: "My Tweet"
                        }
                    }
                })
                .end((err, res) => {
                    res.should.have.status(http_status.OK);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql("Widget successfully added");
                    done();
                });
        });

        it("it should get 1 widget because it added successfully", (done) => {
            chai
                .request(server)
                .get(all_widget_path)
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(http_status.OK);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('widgets');
                    res.body.data.widgets.should.be.a('array');
                    res.body.data.widgets.length.should.be.eql(1);
                    widget = res.body.data.widgets[0];
                    done();
                });
        });
    });


    /*
    * Test the Delete Widget
    */
    describe('Delete Widget', () => {
        it('it should not delete a widget without Authorization', (done) => {
            chai
                .request(server)
                .delete(`${delete_widget_path}/${widget}`)
                .end((err, res) => {
                    res.should.have.status(http_status.BAD_REQUEST);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('it should DELETE 1 widget', (done) => {
            chai
                .request(server)
                .delete(`${delete_widget_path}/${widget._id}`)
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(http_status.OK);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql("Widget successfully deleted");
                    done();
                });
        });
    });
});