from decimal import Decimal


class FinancialHealthService:
    @staticmethod
    def calculate(
        total_income: Decimal,
        total_expense: Decimal,
    ):
        total_income = Decimal(total_income or 0)
        total_expense = Decimal(total_expense or 0)
        total_savings = total_income - total_expense

        # A score is not meaningful until income has been recorded.
        if total_income <= 0:
            return {
                "score": 0,
                "grade": "N/A",
                "total_income": total_income,
                "total_expense": total_expense,
                "total_savings": total_savings,
                "savings_rate": 0.0,
                "expense_ratio": 0.0,
                "summary": (
                    "Record income transactions to calculate your "
                    "financial health score."
                ),
            }

        savings_rate = float(total_savings / total_income * 100)
        expense_ratio = float(total_expense / total_income * 100)

        score = 0
        if savings_rate >= 50:
            score += 70
        elif savings_rate >= 30:
            score += 55
        elif savings_rate >= 20:
            score += 40
        elif savings_rate >= 10:
            score += 20

        if expense_ratio <= 40:
            score += 30
        elif expense_ratio <= 60:
            score += 20
        elif expense_ratio <= 80:
            score += 10

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
            "D": "Review your spending and saving habits.",
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
