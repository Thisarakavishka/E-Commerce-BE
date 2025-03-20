export const generateProductLabelsForCreate = (product) => {
    const labels = [];

    // Add "new" label if created in the last 7 days
    if ((new Date() - product.createdAt) / (1000 * 60 * 60 * 24) <= 7) labels.push("new");

    // Add "discount" label if there is a discount
    if (product.discountPrice && product.discountPrice < product.price) labels.push("discount");

    return labels;
};

export const generateProductLabelsForUpdate = (existingLabels, updatedLabels = []) => {
    let labels = [...existingLabels]; // Start with the existing labels

    // If the user is removing any labels, we remove them from the list
    updatedLabels.forEach(label => {
        if (!labels.includes(label)) {
            labels.push(label);  // Add new labels
        } else {
            // If the user is removing a label, ensure it's removed from the list
            labels = labels.filter(existingLabel => existingLabel !== label);
        }
    });

    return labels;
};
