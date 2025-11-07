from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Category, Transaction, Budget, Goal
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer, GoalSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        total_income = Transaction.objects.filter(
            transaction_type='income'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        total_expense = Transaction.objects.filter(
            transaction_type='expense'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        balance = total_income - total_expense
        
        return Response({
            'total_income': total_income,
            'total_expense': total_expense,
            'balance': balance
        })
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        from django.db.models import Count
        expenses = Transaction.objects.filter(
            transaction_type='expense'
        ).values('category__name', 'category__emoji').annotate(
            total=Sum('amount')
        )
        return Response(expenses)


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer


class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
