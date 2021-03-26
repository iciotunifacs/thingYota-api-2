const mockBuckets = (el, data, entity = 'Sensors') => {
	return {
		url: `/Bucket_${el._id}`,
		payload: {
			entity,
			Actor: data,
			Bucket: el,
		},
		event: 'updated',
	};
};

module.exports = {
	mockBuckets,
};
