const creationLimits = {
    user_purchases: {
        limit: 10,
        condition: "user_fk",
    },
    guest_questions: {
        limit: 10,
        condition: "email"
    },
    user: {
        limit: 10,
        condition: "ip"
    },
    user_tickets: {
        limit: 10,
        condition: "user_fk"
    },
    user_purchase_guests: {
        limit: 10,
        condition: "email"
    }
}

export default creationLimits