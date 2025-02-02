import * as chai from 'chai';
import chaiHttp from 'chai-http';
import {app} from '../src/app.js';
import { Faq } from '../src/model/faq.model.js';

const expect = chai.expect;
chai.use(chaiHttp);

describe('Faq API', () => {
  beforeEach(async (done) => {
    await Faq.deleteMany({});
    done();
  });

  describe('GET /api/faqs', () => {
    it('should get all Faqs', async (done) => {
      await Faq.create([
        { question: 'Question 1', answer: 'Answer 1' },
        { question: 'Question 2', answer: 'Answer 2' },
      ]);

      const res = await chai.request(app).get('/api/v1/User/faq');
      done();
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2);
    });

    it('should get Faqs in a specific language', async (done) => {
      await Faq.create({
        question: 'Question',
        answer: 'Answer',
        translations: {
          es: { question: 'Pregunta', answer: 'Respuesta' }
        }
      });

      const res = await chai.request(app).get('/api/v1/User/faq?lang=es');
      done();
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0].question).to.equal('Pregunta');
      expect(res.body[0].answer).to.equal('Respuesta');
    });
  });
});

describe('Admin API', () => {
  beforeEach(async () => {
    await Faq.deleteMany({});
  });

  describe('PATCH /admin/faqs/:id', () => {
    it('should update an existing Faq', async () => {
      const faq = await Faq.create({ question: 'Old Question', answer: 'Old Answer' });

      const updatedFaq = {
        question: 'Updated Question',
        answer: 'Updated Answer',
      };

      const res = await chai.request(app).patch(`/api/v1/Admin/faq/${faq._id}`).send(updatedFaq);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('question', updatedFaq.question);
      expect(res.body).to.have.property('answer', updatedFaq.answer);
    });

    it('should return 404 if Faq is not found', async () => {
      const id = '60b8f7b9e6fdq34597';
      const res = await chai.request(app).patch(`/api/v1/Admin/faq/${id}`).send({
        question: 'Updated Question',
        answer: 'Updated Answer',
      });
      expect(res).to.have.status(404);
    });
  });

  describe('DELETE /admin/faqs/:id', () => {
    it('should delete an existing Faq', async () => {
      const faq = await Faq.create({ question: 'Question', answer: 'Answer' });

      const res = await chai.request(app).delete(`/api/v1/Admin/faq/${faq._id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Faq deleted successfully');

      const deletedFaq = await Faq.findById(faq._id);
      expect(deletedFaq).to.be.null;
    });

    it('should return 404 if Faq is not found', async () => {
      const id = '60b8f7b9e6fdq34597';
      const res = await chai.request(app).delete(`/api/v1/Admin/faq/${id}`);
      expect(res).to.have.status(404);
    });
  });
});