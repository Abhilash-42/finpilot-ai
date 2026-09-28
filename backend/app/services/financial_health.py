from decimal import Decimal


class FinancialHealthService:

    @staticmethod
    def calculate(
        total_income: Decimal,
        total_expense: Decimal,
    ):

        total_savings = total_income - total_expense

        if total_income == 0:
            savings_rate = 0
            expense_ratio = 0
        else:
            savings_rate = float(
                total_savings / total_income * 100
            )

            expense_ratio = float(
                total_expense / total_income * 100
            )

        score = 0

        # Savings Score (70 Marks)

        if savings_rate >= 50:
            score += 70

        elif savings_rate >= 30:
            score += 55

        elif savings_rate >= 20:
            score += 40

        elif savings_rate >= 10:
            score += 20

        # Expense Score (30 Marks)

        if expense_ratio <= 40:
            score += 30

        elif expense_ratio <= 60:
            score += 20

        elif expense_ratio <= 80:
            score += 10

        # Grade

        if score >= 90:
            grade = "A+"

        elif score >= 80:
            grade = "A"

        elif score >= 70:
            grade = "B"

        elif score >= 60:
            grade = "C"

        else:
            grade = "D"

        summaries = {
            "A+": "Outstanding financial health.",
            "A": "Excellent financial health.",
            "B": "Good financial health.",
            "C": "Needs improvement.",
            "D": "High spending. Focus on saving.",
        }

        return {
            "score": score,
            "grade": grade,
            "total_income": total_income,
            "total_expense": total_expense,
            "total_savings": total_savings,
            "savings_rate": round(savings_rate, 2),
            "expense_ratio": round(expense_ratio, 2),
            "summary": summaries[grade],
        }