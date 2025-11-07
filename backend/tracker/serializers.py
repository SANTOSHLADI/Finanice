from rest_framework import serializers
from .models import Category, Transaction, Budget, Goal

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_emoji = serializers.CharField(source='category.emoji', read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_emoji = serializers.CharField(source='category.emoji', read_only=True)
    spent = serializers.SerializerMethodField()
    
    class Meta:
        model = Budget
        fields = '__all__'
    
    def get_spent(self, obj):
        from django.db.models import Sum
        spent = Transaction.objects.filter(
            category=obj.category,
            transaction_type='expense',
            date__month=obj.month,
            date__year=obj.year
        ).aggregate(total=Sum('amount'))['total']
        return spent or 0


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'