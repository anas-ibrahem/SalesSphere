package com.example.salessphere.util

enum class DealStatus {
    OPEN,
    CLAIMED,
    CLOSED_WON,
    CLOSED_LOST
}

enum class NotificationPriority {
    LOW,
    HIGH
}
enum class NotificationType {
    GENERAL,
    CUSTOMER,
    DEAL,
    DEADLINE,
    TARGET,
    BADGE,
    FINANCE
}

enum class EmployeeRole{
    DEAL_OPENER,
    DEAL_CLOSER,
    MANAGER
}

enum class BadgeType{
    DEALS_OPENED,
    DEALS_CLOSED,
    CUSTOMERS_ADDED,
    REVENUE_GENERATED,
    BADGES_EARNED,
}

enum class TargetType{
    DEAL_OPENED,
    DEAL_CLOSED,
    CUSTOMER_ADDED,
    REVENUE_GENERATED
}

enum class CustomerType{
    INDIVIDUAL,
    COMPANY
}

enum class PreferredContactMethod(val value : Boolean){
    EMAIL(false),
    PHONE(true)
}

enum class PaymentMethod{
    CASH,
    CREDIT_CARD,
    BANK_TRANSFER,
    ELECTRONIC_PAYMENT,
    OTHER
}

enum class FinancialRecordType{
    EXPENSE,
    INCOME
}






