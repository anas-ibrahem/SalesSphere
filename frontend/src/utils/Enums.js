const EmployeeRoles = {
    DealOpener: 0,
    DealExecutor: 1,
    Manager: 2
}

const VerificationStatus = {
    Pending: 0,
    Approved: 1,
    Blocked: 2
}

const CustomerTypes = {
    Individual: 0,
    Company: 1
}

const ContactTypes = {
    Email: false,
    Phone: true
}

const DealStatus = {
    Open: 0,
    Claimed: 1,
    ClosedWon: 2,
    ClosedLost: 3
}

const PaymentMethods = {
    Cash: 0,
    Card: 1,
    BankTransfer: 2,
    ElectronicPayment: 3,
    Other: 4
}

const NotificationPriority = {
    Low: 0,
    High: 1
}

const NotificationTypes = {
    General: 0,
    Customer: 1,
    Deal: 2,
    Deadline: 3,
    Target: 4,
    BadgeAward: 5,
    Finances: 6
}

const AdminPrivileges = {
    Normal: 0,
    Super: 1
}

// Export all enums
export {
    EmployeeRoles,
    VerificationStatus,
    CustomerTypes,
    ContactTypes,
    DealStatus,
    PaymentMethods,
    NotificationPriority,
    AdminPrivileges
};