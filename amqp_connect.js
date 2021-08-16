var amqp = require("amqplib/callback_api");
const EventEmitter = require("events");

var channel = null;
// connecting to the rabbitmq through in-built amqp function
amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, ch) {
    if (error1) {
      throw error1;
    }
    channel = ch;
  });
});

module.exports = (eventEmitter, correlationId, msg1, response_queue) => {
  channel.assertQueue(
    "",
    {
      exclusive: true,
    },
    function (error2, q) {
      if (error2) {
        throw error2;
      }
      msg1 = JSON.stringify(msg1);
      channel.consume(
        q.queue,
        function (msg) {
          eventEmitter.emit(msg.properties.correlationId, msg.content);
        },
        {
          noAck: true,
        }
      );

      channel.sendToQueue(response_queue, Buffer.from(msg1), {
        correlationId: correlationId,
        replyTo: q.queue,
      });
    }
  );
};
