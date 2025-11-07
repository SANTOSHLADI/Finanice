from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Category, Transaction, Budget, Goal

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'emoji', 'transaction_type']

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['description', 'amount', 'transaction_type', 'category', 'date']
    list_filter = ['transaction_type', 'category', 'date']

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['category', 'limit_amount', 'month', 'year']

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['name', 'current_amount', 'target_amount', 'deadline']
