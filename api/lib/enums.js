
export const user_roles = {
    ANONYMOUS: 'anonymous',
    STANDARD: 'standard',
    ADMIN: 'admin'
}

export const every = {
    MINUTE: 'minute',
    HOUR: 'hour',
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year'
}

export const ticket_types = {
    ADVANCE: 'advance',
    STANDBY: 'standby'
}

export const physical_queue_types = {
    ...ticket_types,
    MERGED: 'merged'
}