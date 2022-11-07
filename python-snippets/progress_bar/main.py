import math


def progress_bar(progress: int, total: int):
    """
    progress_bar displays the progress to the user
    :param progress:
    :param total:
    :return:
    """
    percent = 100 * (progress / float(total))
    bar = '=' * int(percent - 1) + '>' + '-' * int(100 - percent)
    print(f"\r|{bar}| {percent:.2f}%", end="\r")


numbers = [x * 5 for x in range(2000, 3000)]
results = []

progress_bar(0, len(numbers))
for i, x in enumerate(numbers):
    results.append(math.factorial(x))
    progress_bar(i+1, len(numbers))

print('\nhi')
