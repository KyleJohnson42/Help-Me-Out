const db = require('../../index');

exports.reportUser = (user, update, cb) => {
  db.User.findByIdAndUpdate(
    { _id: user },
    update,
    { new: true },
    (err, result) => {
      if (err) return cb(err, null);
      return cb(null, result);
    },
  );
};
